import { collection, doc, getDocs, query, where, type QueryDocumentSnapshot } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { AMENITIES, DEFAULT_AMENITIES, DEFAULT_CHECK_IN, DEFAULT_CHECK_OUT, MIN_GAP_MINUTES, MAX_NOTICE, MAX_PHOTO_BYTES, MAX_PHOTOS, MAX_PRICE, MIN_PHOTOS, ROOMS_TEXT, ROOM_TYPES } from "@/content/admin";
import { db, storage } from "@/lib/firebase";
import { ServerError } from "@/utils/auth-errors";
import { MODEL_CONFIG } from "./config";
import { Model } from "./Model";

export type RoomData = {
  id: string;
  number: string;
  name: string;
  type: (typeof ROOM_TYPES)[number];
  amenities: (typeof AMENITIES)[number][];
  price: number;
  checkIn: string;
  checkOut: string;
  notice: string;
  photos: string[];
  active: boolean;
};

const minutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

/**
 * A room of the `rooms` collection. Every edit returns a new Room, so a form can keep one in state.
 * Read and written straight from the browser; firestore.rules check the same things again.
 */
export class Room extends Model<RoomData> {
  static collection = "rooms";
  static limit: number = MODEL_CONFIG.limits.rooms;
  static writable = true;

  readonly number: string;
  readonly name: string;
  readonly type: RoomData["type"];
  readonly amenities: RoomData["amenities"];
  readonly price: number;
  readonly checkIn: string;
  readonly checkOut: string;
  readonly notice: string;
  readonly photos: string[];
  readonly active: boolean;

  constructor(data: RoomData) {
    super(data);
    this.number = data.number;
    this.name = data.name;
    this.type = data.type;
    this.amenities = data.amenities;
    this.price = data.price;
    this.checkIn = data.checkIn;
    this.checkOut = data.checkOut;
    this.notice = data.notice;
    this.photos = data.photos;
    this.active = data.active;
  }

  /** A blank room. Its id is made now, because the photos live in rooms/<id>/ in Storage before the room is saved. */
  static create() {
    return new Room({
      id: doc(collection(db, Room.collection)).id, number: "", name: "", type: ROOM_TYPES[0],
      amenities: AMENITIES.filter((a) => DEFAULT_AMENITIES.includes(a)), price: 0, checkIn: DEFAULT_CHECK_IN, checkOut: DEFAULT_CHECK_OUT, notice: "", photos: [], active: true,
    });
  }

  /** By room number, so 2 comes before 10. */
  static byNumber(a: Room, b: Room) {
    return a.number.localeCompare(b.number, undefined, { numeric: true });
  }

  /** Rooms saved before name, price, features and photos existed read with empty defaults, so they can be edited. */
  static fromSnapshot(d: QueryDocumentSnapshot) {
    return new Room({
      id: d.id,
      number: d.get("number"),
      name: d.get("name") ?? "",
      type: d.get("type"),
      amenities: d.get("amenities") ?? [],
      price: d.get("price") ?? 0,
      checkIn: d.get("checkIn") ?? DEFAULT_CHECK_IN,
      checkOut: d.get("checkOut") ?? DEFAULT_CHECK_OUT,
      notice: d.get("notice") ?? "",
      photos: d.get("photos") ?? [],
      active: d.get("active") ?? true,
    });
  }

  toData(): RoomData {
    const { id, number, name, type, amenities, price, checkIn, checkOut, notice, photos, active } = this;
    return { id, number, name, type, amenities, price, checkIn, checkOut, notice, photos, active };
  }

  get title() {
    return this.name || this.type;
  }
  get firstPhoto(): string | undefined {
    return this.photos[0];
  }
  has(amenity: RoomData["amenities"][number]) {
    return this.amenities.includes(amenity);
  }
  /** Keeps the order of the AMENITIES list, whatever order they were ticked in. */
  withAmenity(amenity: RoomData["amenities"][number], on: boolean) {
    return this.with({ amenities: AMENITIES.filter((a) => (a === amenity ? on : this.has(a))) });
  }

  /** Whether `extra` more photos (still uploading) would fit. */
  canAddPhotos(extra = 0) {
    return this.photos.length + extra < MAX_PHOTOS;
  }
  /** Why these files cannot be added, or "" when they can. `uploading` counts photos already on their way. */
  photoProblem(files: File[], uploading = 0) {
    if (files.some((f) => !f.type.startsWith("image/"))) return ROOMS_TEXT.notAnImage;
    if (files.some((f) => f.size > MAX_PHOTO_BYTES)) return ROOMS_TEXT.tooBig;
    if (this.photos.length + uploading + files.length > MAX_PHOTOS) return ROOMS_TEXT.tooMany;
    return "";
  }
  /** Uploads each file to rooms/<id>/ in Storage. Returns the links of the ones that worked. */
  // shortcut: a photo removed or left unsaved stays in Storage; clean up by hand or add a sweep if it adds up.
  async uploadPhotos(files: File[]) {
    const results = await Promise.allSettled(
      files.map(async (file) => {
        const extension = file.name.split(".").pop()?.replace(/[^A-Za-z0-9]/g, "").slice(0, 5) || "jpg";
        const photo = ref(storage, `rooms/${this.id}/${crypto.randomUUID()}.${extension}`);
        await uploadBytes(photo, file, { contentType: file.type });
        return getDownloadURL(photo);
      }),
    );
    return results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  }
  withPhotos(urls: string[]) {
    return this.with({ photos: [...this.photos, ...urls] });
  }
  withoutPhoto(url: string) {
    return this.with({ photos: this.photos.filter((p) => p !== url) });
  }

  /** Why check-in and check-out do not fit together, or "". Check-out must be at least MIN_GAP_MINUTES before check-in. */
  get timesProblem() {
    const time = /^([01]\d|2[0-3]):[0-5]\d$/;
    const ok = time.test(this.checkIn) && time.test(this.checkOut) && minutes(this.checkIn) - minutes(this.checkOut) >= MIN_GAP_MINUTES;
    return ok ? "" : ROOMS_TEXT.badTimes;
  }

  /** What stops this room being saved right now, or "". The Firestore rules check the same things. */
  get problem() {
    if (!/^[A-Za-z0-9-]{1,10}$/.test(this.number)) return ROOMS_TEXT.badNumber;
    if (this.name.trim().length < 1 || this.name.trim().length > 60) return ROOMS_TEXT.badName;
    if (!Number.isInteger(this.price) || this.price <= 0 || this.price > MAX_PRICE) return ROOMS_TEXT.badPrice;
    if (this.timesProblem) return this.timesProblem;
    if (this.notice.trim().length > MAX_NOTICE) return ROOMS_TEXT.badNotice;
    if (this.has("Non-smoking") && this.has("Smoking allowed")) return ROOMS_TEXT.badFeatures;
    if (this.photos.length < MIN_PHOTOS) return ROOMS_TEXT.needPhotos;
    return "";
  }

  protected dataToSave() {
    const { id, ...fields } = this.toData(); // eslint-disable-line @typescript-eslint/no-unused-vars
    return { ...fields, name: this.name.trim(), notice: this.notice.trim() };
  }

  async save() {
    if (this.problem) throw new ServerError(this.problem);
    // shortcut: two admins saving the same number at once could both pass this check; fine for a few staff.
    const taken = await getDocs(query(collection(db, Room.collection), where("number", "==", this.number)));
    if (taken.docs.some((d) => d.id !== this.id)) throw new ServerError(ROOMS_TEXT.numberTaken);
    await super.save();
  }
}
