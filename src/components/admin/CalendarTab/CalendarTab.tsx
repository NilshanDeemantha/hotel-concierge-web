"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { TextField } from "@/components/ui/TextField";
import { inputClass, labelClass } from "@/components/ui/TextField/TextField.styles";
import { ADMIN_TEXT, CALENDAR_TEXT, STATUS_TEXT } from "@/content/admin";
import { getAvailability, listRooms, setAvailability, type AdminRoom, type AvailabilityMonth } from "@/lib/admin-api";
import { authCardClass, primaryButtonClass, smallButtonClass } from "@/styles/classes";
import { errorMessage } from "@/utils/auth-errors";
import { cellClass } from "./CalendarTab.styles";

type Status = keyof typeof STATUS_TEXT;

// Current month in local time, as YYYY-MM.
function thisMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function daysOf(month: string) {
  const [year, m] = month.split("-").map(Number);
  const count = new Date(year, m, 0).getDate(); // day 0 of the next month is the last day of this one
  return Array.from({ length: count }, (_, i) => String(i + 1).padStart(2, "0"));
}

export function CalendarTab() {
  const [month, setMonth] = useState(thisMonth);
  const [rooms, setRooms] = useState<AdminRoom[]>();
  const [data, setData] = useState<AvailabilityMonth>();
  const [version, setVersion] = useState(0);
  const [roomsVersion, setRoomsVersion] = useState(0);
  const [roomsError, setRoomsError] = useState("");
  const [monthError, setMonthError] = useState("");
  const [form, setForm] = useState({ roomId: "", from: "", to: "", status: "booked" as Status, note: "" });
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    listRooms().then(
      (all) => active && setRooms(all.filter((room) => room.active)),
      (e) => active && setRoomsError(errorMessage(e)),
    );
    return () => {
      active = false;
    };
  }, [roomsVersion]);

  useEffect(() => {
    // Ignore a slow answer for a month that is no longer shown.
    let active = true;
    getAvailability(month).then(
      ({ days }) => {
        if (!active) return;
        setData({ month, days });
        setMonthError("");
      },
      (e) => active && setMonthError(errorMessage(e)),
    );
    return () => {
      active = false;
    };
  }, [month, version]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.roomId || !form.from || !form.to) return;
    setFormError("");
    setBusy(true);
    try {
      await setAvailability({ ...form, note: form.note || undefined });
      setVersion((v) => v + 1);
    } catch (e) {
      // The server's message, such as a night already taken (409), is written to be shown.
      setFormError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  const shown = data?.month === month ? data : undefined;
  const days = daysOf(month);

  return (
    <div className="flex flex-col gap-6">
      <label className={`${labelClass} max-w-60`}>
        {CALENDAR_TEXT.month}
        <input
          type="month"
          className={inputClass}
          required
          value={month}
          onChange={(e) => {
            if (!e.target.value) return;
            setMonthError("");
            setMonth(e.target.value);
          }}
        />
      </label>

      <ErrorAlert message={roomsError} />
      {roomsError && (
        <button
          type="button"
          className={`${smallButtonClass} self-start`}
          onClick={() => {
            setRoomsError("");
            setRoomsVersion((v) => v + 1);
          }}
        >
          {ADMIN_TEXT.retry}
        </button>
      )}
      <ErrorAlert message={monthError} />
      {((!rooms && !roomsError) || (!shown && !monthError)) && <p className="text-muted">{ADMIN_TEXT.loading}</p>}
      {rooms?.length === 0 && <p className="text-muted">{CALENDAR_TEXT.noRooms}</p>}
      {rooms && rooms.length > 0 && shown && (
        <div>
          <div className="overflow-x-auto">
            <table className="border-collapse text-center text-xs">
              <thead>
                <tr>
                  <th className="p-1 text-left">{CALENDAR_TEXT.room}</th>
                  {days.map((day) => (
                    <th key={day} className="min-w-7 p-1 font-normal text-muted">
                      {Number(day)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <th className="p-1 pr-3 text-left font-semibold whitespace-nowrap">{room.number}</th>
                    {days.map((day) => {
                      const entry = shown.days[room.id]?.[day];
                      const status: Status = entry?.status ?? "free";
                      const date = `${month}-${day}`;
                      const label = CALENDAR_TEXT.cell(room.number, date, STATUS_TEXT[status].label, entry?.note);
                      return (
                        <td key={day} title={label} aria-label={label} className={cellClass[status]}>
                          {STATUS_TEXT[status].short}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-muted">{CALENDAR_TEXT.legend}</p>
        </div>
      )}

      {rooms && rooms.length > 0 && (
        <form className={`flex max-w-[420px] flex-col gap-[18px] ${authCardClass}`} onSubmit={handleSubmit}>
          <h2 className="font-serif text-2xl font-medium">{CALENDAR_TEXT.formTitle}</h2>
          <label className={labelClass}>
            {CALENDAR_TEXT.room}
            <select
              className={inputClass}
              required
              value={form.roomId}
              onChange={(e) => setForm({ ...form, roomId: e.target.value })}
            >
              <option value="">{CALENDAR_TEXT.chooseRoom}</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.number} · {room.type}
                </option>
              ))}
            </select>
          </label>
          <TextField
            label={CALENDAR_TEXT.from}
            type="date"
            required
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
          />
          <TextField
            label={CALENDAR_TEXT.to}
            type="date"
            required
            min={form.from || undefined}
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
          />
          <p className="-mt-2 text-sm text-muted">{CALENDAR_TEXT.rangeHint}</p>
          <label className={labelClass}>
            {CALENDAR_TEXT.status}
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
            >
              {(Object.keys(STATUS_TEXT) as Status[]).map((status) => (
                <option key={status} value={status}>
                  {STATUS_TEXT[status].label}
                </option>
              ))}
            </select>
          </label>
          <TextField
            label={CALENDAR_TEXT.note}
            maxLength={200}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
          <ErrorAlert message={formError} />
          <button type="submit" className={primaryButtonClass} disabled={busy}>
            {busy ? ADMIN_TEXT.saving : CALENDAR_TEXT.submit}
          </button>
        </form>
      )}
    </div>
  );
}
