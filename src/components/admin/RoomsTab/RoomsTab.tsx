"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { AvailabilityPanel } from "@/components/admin/AvailabilityPanel";
import { LoadError } from "@/components/admin/LoadError";
import { RoomGallery } from "@/components/admin/RoomGallery";
import { Photo } from "@/components/ui/Photo";
import { TextField } from "@/components/ui/TextField";
import { inputClass, labelClass } from "@/components/ui/TextField/TextField.styles";
import { ADMIN_TEXT, AMENITIES, AVAILABILITY_TEXT, ROOMS_TEXT, ROOM_TYPES } from "@/content/admin";
import { useRooms } from "@/hooks/admin/useAdminData";
import { useHeaderSlot } from "@/hooks/admin/useHeaderSlot";
import { Room, type RoomData } from "@/models/Room";
import { primaryButtonClass, smallButtonClass } from "@/styles/classes";
import { ServerError } from "@/utils/auth-errors";

export function RoomsTab() {
  const list = useRooms();
  const headerSlot = useHeaderSlot();
  const [editing, setEditing] = useState<Room>();
  const [availabilityOf, setAvailabilityOf] = useState<Room>();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);

  const patch = (change: Partial<RoomData>) => setEditing((room) => room?.with(change));

  async function addPhotos(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // so choosing the same file again still fires
    if (!editing || files.length === 0) return;
    const problem = editing.photoProblem(files, uploading);
    if (problem) return void toast.error(problem);
    setUploading((n) => n + files.length);
    const urls = await editing.uploadPhotos(files);
    setUploading((n) => n - files.length);
    setEditing((room) => room?.withPhotos(urls));
    if (urls.length < files.length) toast.warning(ROOMS_TEXT.uploadFailed);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!editing || saving || uploading > 0) return;
    if (editing.problem) return void toast.error(editing.problem);
    setSaving(true);
    try {
      await editing.save();
      toast.success(ROOMS_TEXT.saved);
      setEditing(undefined); // the live query shows the saved room
    } catch (err) {
      toast.error(err instanceof ServerError ? err.message : ROOMS_TEXT.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  const open = (room: Room) => setEditing(room);

  if (editing) {
    return (
      <form onSubmit={submit} className="flex max-w-2xl flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-serif text-2xl font-medium">{list.data?.some((r) => r.id === editing.id) ? ROOMS_TEXT.formTitleEdit : ROOMS_TEXT.formTitleNew}</h2>
        <div className="grid gap-4 @xl:grid-cols-2">
          <TextField label={ROOMS_TEXT.number} value={editing.number} maxLength={10} required
            onChange={(e) => patch({ number: e.target.value.trim() })} />
          <TextField label={ROOMS_TEXT.name} value={editing.name} maxLength={60} required
            onChange={(e) => patch({ name: e.target.value })} />
          <label className={labelClass}>
            {ROOMS_TEXT.type}
            <select className={inputClass} value={editing.type} onChange={(e) => patch({ type: e.target.value as Room["type"] })}>
              {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <TextField label={ROOMS_TEXT.price} type="number" inputMode="numeric" min={1} step={1} required
            value={editing.price || ""} onChange={(e) => patch({ price: Math.round(Number(e.target.value)) })} />
          <TextField label={ROOMS_TEXT.checkIn} type="time" required value={editing.checkIn}
            onChange={(e) => patch({ checkIn: e.target.value })} />
          <TextField label={ROOMS_TEXT.checkOut} type="time" required value={editing.checkOut}
            onChange={(e) => patch({ checkOut: e.target.value })} />
          <p role="alert" className={`text-sm @xl:col-span-2 ${editing.timesProblem ? "font-semibold text-[#9A3A1B]" : "text-muted"}`}>
            {editing.timesProblem || ROOMS_TEXT.timesHint}
          </p>
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-semibold">{ROOMS_TEXT.features}</legend>
          <div className="grid grid-cols-2 gap-2 @xl:grid-cols-3">
            {AMENITIES.map((a) => (
              <label key={a} className="flex min-h-11 items-center gap-2">
                <input type="checkbox" className="size-5 accent-brand" checked={editing.has(a)}
                  onChange={(e) => setEditing(editing.withAmenity(a, e.target.checked))} />
                {a}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-semibold">{ROOMS_TEXT.photos}</legend>
          <p className="text-sm text-muted">{ROOMS_TEXT.photosHint} {ROOMS_TEXT.photosCount(editing.photos.length)}</p>
          <ul className="grid grid-cols-4 gap-2 @xl:grid-cols-6">
            {editing.photos.map((url, i) => (
              <li key={url} className="relative">
                <Photo src={url} alt={ROOMS_TEXT.photoAlt(i + 1)} sizes="100px" className="relative aspect-square overflow-hidden rounded-lg" />
                <button type="button" aria-label={ROOMS_TEXT.removePhoto(i + 1)}
                  className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-black/60 text-sm leading-none text-white"
                  onClick={() => setEditing(editing.withoutPhoto(url))}>
                  ×
                </button>
              </li>
            ))}
          </ul>
          {editing.canAddPhotos(uploading) && (
            <label className={`${smallButtonClass} inline-flex cursor-pointer items-center self-start`}>
              {uploading > 0 ? ROOMS_TEXT.uploading : ROOMS_TEXT.addPhotos}
              <input type="file" accept="image/*" multiple className="sr-only" onChange={addPhotos} />
            </label>
          )}
        </fieldset>
        <label className={labelClass}>
          {ROOMS_TEXT.notice}
          <textarea className={`${inputClass} h-24 py-2.5`} value={editing.notice} maxLength={300}
            aria-describedby="notice-hint" onChange={(e) => patch({ notice: e.target.value })} />
          <span id="notice-hint" className="text-sm font-normal text-muted">{ROOMS_TEXT.noticeHint}</span>
        </label>
        <label className="flex min-h-11 items-center gap-2 font-semibold">
          <input type="checkbox" className="size-5 accent-brand" checked={editing.active}
            onChange={(e) => patch({ active: e.target.checked })} />
          {ROOMS_TEXT.active}
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={saving || uploading > 0} className={`${primaryButtonClass} @xl:w-auto`}>
            {saving ? ROOMS_TEXT.saving : ROOMS_TEXT.save}
          </button>
          <button type="button" className={smallButtonClass} onClick={() => setEditing(undefined)}>{ROOMS_TEXT.cancel}</button>
        </div>
      </form>
    );
  }

  if (availabilityOf) return <AvailabilityPanel room={availabilityOf} onClose={() => setAvailabilityOf(undefined)} />;

  if (list.error) return <LoadError message={list.error} onRetry={list.retry} />;
  if (!list.data) return <p className="text-muted">{ADMIN_TEXT.loading}</p>;

  return (
    <div className="flex flex-col gap-4">
      {headerSlot && createPortal(
        <button type="button" className={smallButtonClass} onClick={() => open(Room.create())}>{ROOMS_TEXT.add}</button>,
        headerSlot,
      )}
      {list.data.length === 0 && <p className="text-muted">{ROOMS_TEXT.empty}</p>}
      <ul aria-label={ROOMS_TEXT.listLabel} className="grid gap-3 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {list.data.map((r) => (
          <li key={r.id} className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-3">
            <RoomGallery photos={r.photos} />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold">{r.number} · {r.title}</p>
                <p className="text-xs text-muted">{r.type}</p>
              </div>
              <div className="text-right">
                {r.price > 0 && <p className="text-sm font-semibold text-brand">{ROOMS_TEXT.perNight(r.price)}</p>}
                {!r.active && <span className="mt-1 inline-block rounded-full bg-line px-3 py-0.5 text-sm">{ROOMS_TEXT.inactive}</span>}
              </div>
            </div>
            <p className="text-xs text-muted">{ROOMS_TEXT.checkInOut(r.checkIn, r.checkOut)}</p>
            {r.amenities.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {r.amenities.map((a) => (
                  <li key={a} className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs text-brand">{a}</li>
                ))}
              </ul>
            )}
            {r.notice && <p className="rounded-lg bg-bg px-2.5 py-1.5 text-xs text-muted">{r.notice}</p>}
            <div className="mt-auto flex gap-2">
              <button type="button" className={smallButtonClass} onClick={() => open(r)}>{ROOMS_TEXT.edit}</button>
              <button type="button" className={smallButtonClass} onClick={() => setAvailabilityOf(r)}>{AVAILABILITY_TEXT.open}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
