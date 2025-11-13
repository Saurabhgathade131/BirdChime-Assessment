// backend/src/lib/time.ts
import { addMinutes } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

// Timezone & business hour configuration
const TZ = process.env.BUSINESS_TZ || "Asia/Kolkata";
const OPEN = 9;   // 09:00
const CLOSE = 17; // up to 17:00
export const SLOT_MINUTES = 30;

// Helpers
export const toUTC = (iso: string) => new Date(iso);
export const isPastUTC = (d: Date) => d.getTime() <= Date.now();

/**
 * Check if a given UTC datetime falls within valid business hours (Mon–Fri, 9–17 local time)
 * and is aligned to a 30-minute slot.
 */
export function isBusinessSlotUTC(startsAtUTC: Date) {
  const local = toZonedTime(startsAtUTC, TZ); // ✅ new API
  const dow = local.getDay(); // 0 (Sun) .. 6 (Sat)
  if (dow === 0 || dow === 6) return false; // weekends invalid

  const minutes = local.getMinutes();
  const aligned = minutes % SLOT_MINUTES === 0;
  const hour = local.getHours();
  const withinHours = hour >= OPEN && hour < CLOSE;

  return aligned && withinHours;
}

/**
 * Compute the UTC end time for a slot (30 minutes after start)
 */
export const toEndsAtUTC = (startsAtUTC: Date) => addMinutes(startsAtUTC, SLOT_MINUTES);



export function weekSlotsUTC(mondayISO: string) {
  const monday = new Date(mondayISO);
  const slots: Date[] = [];
  for (let d = 0; d < 5; d++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + d);
    for (let h = OPEN; h < CLOSE; h++) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        const slot = new Date(day);
        slot.setHours(h, m, 0, 0);
        slots.push(slot);
      }
    }
  }
  return slots;
}

export const toEndsAt = (start: Date) => addMinutes(start, SLOT_MINUTES);
