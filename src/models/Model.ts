import { collection, doc, getDoc, limit, query, serverTimestamp, setDoc, Timestamp, type QueryConstraint } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MODEL_CONFIG } from "./config";

/**
 * What every model shares. A model is one Firestore collection, read and written straight from the browser
 * (firestore.rules decide who may, and check what is written). Instances never change: `with()` returns a copy.
 * A subclass sets the statics, holds its fields and implements `toData()`.
 */
export abstract class Model<Data extends { id: string }> {
  /** The Firestore collection. */
  static collection = "";
  /** How many documents a list reads. */
  static limit: number = MODEL_CONFIG.limits.conversations;
  /** Whether the browser may write this collection (firestore.rules must agree). */
  static writable = false;

  readonly id: string;

  constructor(data: Data) {
    this.id = data.id;
  }

  /** The plain fields, as the server receives them. */
  abstract toData(): Data;

  with(change: Partial<Data>): this {
    const Same = this.constructor as new (data: Data) => this;
    return new Same({ ...this.toData(), ...change });
  }

  /** A query over this collection, capped at the model's limit. */
  static listQuery(...constraints: QueryConstraint[]) {
    return query(collection(db, this.collection), ...constraints, limit(this.limit));
  }

  /** A pending server timestamp reads as null until the server has set it. */
  static toDate(value: unknown) {
    return value instanceof Timestamp ? value.toDate() : null;
  }

  /** What gets written: the fields without the id (the id is the document's name). A subclass cleans them up here. */
  protected dataToSave(): Partial<Data> {
    const fields: Partial<Data> = this.toData();
    delete fields.id;
    return fields;
  }

  /** Creates the document under this id, or updates it. Throws when the rules refuse. */
  async save() {
    const { writable, collection: name } = this.constructor as typeof Model;
    if (!writable) throw new Error(`${this.constructor.name} cannot be saved from the browser.`);
    const ref = doc(db, name, this.id);
    const exists = (await getDoc(ref)).exists();
    await setDoc(ref, { ...this.dataToSave(), updatedAt: serverTimestamp(), ...(exists ? {} : { createdAt: serverTimestamp() }) }, { merge: true });
  }
}
