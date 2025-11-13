import { formatInTimeZone } from "date-fns-tz";

const DEFAULT_TZ =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";

export function fmtSlot(iso: string, tz = DEFAULT_TZ) {
  return formatInTimeZone(new Date(iso), tz, "EEE, dd MMM yyyy • hh:mm a");
}
export function fmtTime(iso: string, tz = DEFAULT_TZ) {
  return formatInTimeZone(new Date(iso), tz, "hh:mm a");
}
export const clampLen = (s: string, max: number) =>
  s.length > max ? s.slice(0, max) : s;

export function todayISO(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

