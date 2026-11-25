"use client";

import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { LoadError } from "@/components/admin/LoadError";
import { TextField } from "@/components/ui/TextField";
import { inputClass, labelClass } from "@/components/ui/TextField/TextField.styles";
import { ADMIN_TEXT, AVAILABILITY_TEXT as T, MAX_AVAILABILITY_NOTE } from "@/content/admin";
import { useAvailability } from "@/hooks/admin/useAdminData";
import { Availability, type DateKey, type DayStatus } from "@/models/Availability";
import { primaryButtonClass, smallButtonClass } from "@/styles/classes";
import { ServerError } from "@/utils/auth-errors";
import type { AvailabilityPanelProps } from "./AvailabilityPanel.types";

const STATUS_CLASS: Record<string, string> = {
  booked: "border-[#D64545] bg-[#FBEDE8] text-[#9A3A1B]",
  blocked: "border-line bg-line text-muted",
};
const monthStart = (month: string) => new Date(`${month}-01T00:00:00Z`);

/** A room's calendar: what is booked or removed, and a form to remove nights, mark them booked or free them. */
export function AvailabilityPanel({ room, onClose }: AvailabilityPanelProps) {
  const today = Availability.dateKey(new Date());
  const list = useAvailability(room.id);
  const [month, setMonth] = useState(today.slice(0, 7));
  const [from, setFrom] = useState<DateKey>(today);
  const [until, setUntil] = useState<DateKey>(Availability.addDays(today, 1));
  const [action, setAction] = useState<DayStatus | "free">("blocked");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  if (list.error) return <LoadError message={list.error} onRetry={list.retry} />;
  if (!list.data) return <p className="text-muted">{ADMIN_TEXT.loading}</p>;

  const taken = Availability.takenDays(list.data);
  const nights = Availability.nights(from, until);
  const conflicts = action === "free" ? [] : Availability.conflicts(taken, nights);
  const problem = Availability.rangeProblem(from, until, note) || (conflicts.length ? T.conflict(conflicts) : "");

  const first = monthStart(month);
  const lead = (first.getUTCDay() + 6) % 7; // blank cells before the 1st, weeks start on Monday
  const length = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const days = Array.from({ length }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}` as DateKey);
  const takenThisMonth = days.filter((d) => taken.has(d));
  const shiftMonth = (by: number) => {
    const d = monthStart(month);
    d.setUTCMonth(d.getUTCMonth() + by);
    setMonth(d.toISOString().slice(0, 7));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (problem) return void toast.error(problem);
    setSaving(true);
    try {
      await Availability.apply(room.id, nights, action, note);
      toast.success(T.done[action]);
      setNote("");
    } catch (err) {
      toast.error(err instanceof ServerError ? err.message : T.failed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-serif text-2xl font-medium">{T.title(`${room.number} · ${room.title}`)}</h2>
        <button type="button" className={smallButtonClass} onClick={onClose}>{T.close}</button>
      </div>
      <p className="text-sm text-muted">{T.loadHint}</p>

      <div className="flex items-center justify-between">
        <button type="button" className={smallButtonClass} aria-label={T.prevMonth} onClick={() => shiftMonth(-1)}>‹</button>
        <p className="font-semibold" aria-live="polite">
          {first.toLocaleDateString(undefined, { month: "long", year: "numeric", timeZone: "UTC" })}
        </p>
        <button type="button" className={smallButtonClass} aria-label={T.nextMonth} onClick={() => shiftMonth(1)}>›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {T.weekdays.map((w) => <span key={w}>{w}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: lead }, (_, i) => <span key={`blank-${i}`} />)}
        {days.map((d) => {
          const entry = taken.get(d);
          const selected = nights.includes(d);
          return (
            <button
              key={d}
              type="button"
              title={entry?.note}
              aria-label={T.dayAria(d, T.status[entry?.status ?? "free"])}
              aria-pressed={selected}
              className={`min-h-11 rounded-lg border text-sm ${entry ? STATUS_CLASS[entry.status] : "border-line bg-surface"} ${selected ? "ring-2 ring-brand" : ""}`}
              onClick={() => { setFrom(d); setUntil(Availability.addDays(d, 1)); }}
            >
              {Number(d.slice(8))}
            </button>
          );
        })}
      </div>
      <ul className="flex flex-wrap gap-3 text-xs text-muted">
        {Object.entries(T.status).map(([key, label]) => (
          <li key={key} className="flex items-center gap-1.5">
            <span className={`size-3 rounded border ${STATUS_CLASS[key] ?? "border-line bg-surface"}`} />
            {label}
          </li>
        ))}
      </ul>

      <section className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold">{T.taken}</h3>
        {takenThisMonth.length === 0 && <p className="text-sm text-muted">{T.noneTaken}</p>}
        <ul className="flex flex-col gap-1 text-sm">
          {takenThisMonth.map((d) => (
            <li key={d}>
              <span className="font-semibold">{T.dayLabel(d)}</span> · {T.status[taken.get(d)!.status]}
              {taken.get(d)!.note && <span className="text-muted"> · {taken.get(d)!.note}</span>}
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={submit} className="flex flex-col gap-4 border-t border-line pt-4">
        <h3 className="text-sm font-semibold">{T.change}</h3>
        <div className="grid gap-4 @xl:grid-cols-2">
          <TextField label={T.from} type="date" required value={from} onChange={(e) => setFrom(e.target.value)} />
          <TextField label={T.until} type="date" required value={until} min={Availability.addDays(from, 1)}
            onChange={(e) => setUntil(e.target.value)} />
          <label className={labelClass}>
            {T.action}
            <select className={inputClass} value={action} onChange={(e) => setAction(e.target.value as DayStatus | "free")}>
              {Object.entries(T.actions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <TextField label={T.note} value={note} maxLength={MAX_AVAILABILITY_NOTE} placeholder={T.notePlaceholder}
            onChange={(e) => setNote(e.target.value)} />
        </div>
        <p role="alert" className={`text-sm ${problem ? "font-semibold text-[#9A3A1B]" : "text-muted"}`}>
          {problem || `${T.nights(nights.length)}. ${T.untilHint}`}
        </p>
        <button type="submit" disabled={saving || Boolean(problem)} className={`${primaryButtonClass} @xl:w-auto`}>
          {saving ? T.applying : T.apply}
        </button>
      </form>
    </div>
  );
}
