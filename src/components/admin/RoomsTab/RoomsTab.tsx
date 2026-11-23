"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { TextField } from "@/components/ui/TextField";
import { inputClass, labelClass } from "@/components/ui/TextField/TextField.styles";
import { ADMIN_TEXT, ROOM_TYPES, ROOMS_TEXT } from "@/content/admin";
import { listRooms, saveRoom, type AdminRoom } from "@/lib/admin-api";
import { authCardClass, primaryButtonClass, smallButtonClass } from "@/styles/classes";
import { errorMessage } from "@/utils/auth-errors";

// Same rule as the server, which is the check that counts.
const ROOM_NUMBER_PATTERN = "[A-Za-z0-9\\-]{1,10}";
const emptyRoom = { number: "", type: ROOM_TYPES[0] as string, active: true };

export function RoomsTab() {
  const [rooms, setRooms] = useState<AdminRoom[]>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState(emptyRoom);
  const [editing, setEditing] = useState<AdminRoom>();

  useEffect(() => {
    listRooms().then(setRooms, (e) => setError(errorMessage(e)));
  }, []);

  // Saves, then reloads the list so the table shows what the server stored.
  async function save(room: Parameters<typeof saveRoom>[0], done: () => void) {
    setError("");
    setBusy(true);
    try {
      await saveRoom(room);
      setRooms(await listRooms());
      done();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    save(draft, () => setDraft(emptyRoom));
  }

  function handleEdit(event: FormEvent) {
    event.preventDefault();
    if (editing) save(editing, () => setEditing(undefined));
  }

  const typeSelect = (value: string, onChange: (type: string) => void, label?: string) => (
    <select className={inputClass} value={value} aria-label={label} onChange={(e) => onChange(e.target.value)}>
      {ROOM_TYPES.map((type) => (
        <option key={type}>{type}</option>
      ))}
    </select>
  );

  return (
    <div className="flex flex-col gap-6">
      <ErrorAlert message={error} />

      {!rooms && !error && <p className="text-muted">{ADMIN_TEXT.loading}</p>}
      {rooms?.length === 0 && <p className="text-muted">{ROOMS_TEXT.empty}</p>}
      {rooms && rooms.length > 0 && (
        // One form for the row being edited, so its inputs sit inside the table cells.
        <form id="room-edit" onSubmit={handleEdit} className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-sm text-muted">
              <tr>
                <th className="p-2">{ROOMS_TEXT.number}</th>
                <th className="p-2">{ROOMS_TEXT.type}</th>
                <th className="p-2">{ROOMS_TEXT.active}</th>
                <th className="p-2">{ROOMS_TEXT.actions}</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) =>
                editing?.id === room.id ? (
                  <tr key={room.id} className="border-t border-line">
                    <td className="p-2">
                      <TextField
                        label={<span className="sr-only">{ROOMS_TEXT.editNumber(room.number)}</span>}
                        required
                        pattern={ROOM_NUMBER_PATTERN}
                        maxLength={10}
                        value={editing.number}
                        onChange={(e) => setEditing({ ...editing, number: e.target.value })}
                      />
                    </td>
                    <td className="p-2">
                      {typeSelect(
                        editing.type,
                        (type) => setEditing({ ...editing, type }),
                        ROOMS_TEXT.editType(room.number),
                      )}
                    </td>
                    <td className="p-2">{room.active ? ADMIN_TEXT.yes : ADMIN_TEXT.no}</td>
                    <td className="space-x-2 p-2 whitespace-nowrap">
                      <button type="submit" className={smallButtonClass} disabled={busy}>
                        {busy ? ADMIN_TEXT.saving : ADMIN_TEXT.save}
                      </button>
                      <button type="button" className={smallButtonClass} onClick={() => setEditing(undefined)}>
                        {ADMIN_TEXT.cancel}
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={room.id} className="border-t border-line">
                    <td className="p-2 font-semibold">{room.number}</td>
                    <td className="p-2">{room.type}</td>
                    <td className="p-2">{room.active ? ADMIN_TEXT.yes : ADMIN_TEXT.no}</td>
                    <td className="space-x-2 p-2 whitespace-nowrap">
                      <button type="button" className={smallButtonClass} onClick={() => setEditing(room)}>
                        {ROOMS_TEXT.edit}
                      </button>
                      <button
                        type="button"
                        className={smallButtonClass}
                        disabled={busy}
                        onClick={() => save({ ...room, active: !room.active }, () => {})}
                      >
                        {room.active ? ROOMS_TEXT.deactivate : ROOMS_TEXT.reactivate}
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </form>
      )}

      <form className={`flex max-w-[420px] flex-col gap-[18px] ${authCardClass}`} onSubmit={handleAdd}>
        <h2 className="font-serif text-2xl font-medium">{ROOMS_TEXT.addTitle}</h2>
        <TextField
          label={ROOMS_TEXT.number}
          required
          pattern={ROOM_NUMBER_PATTERN}
          maxLength={10}
          title={ROOMS_TEXT.numberHint}
          value={draft.number}
          onChange={(e) => setDraft({ ...draft, number: e.target.value })}
        />
        <label className={labelClass}>
          {ROOMS_TEXT.type}
          {typeSelect(draft.type, (type) => setDraft({ ...draft, type }))}
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
          />
          {ROOMS_TEXT.active}
        </label>
        <button type="submit" className={primaryButtonClass} disabled={busy}>
          {busy ? ADMIN_TEXT.saving : ROOMS_TEXT.add}
        </button>
      </form>
    </div>
  );
}
