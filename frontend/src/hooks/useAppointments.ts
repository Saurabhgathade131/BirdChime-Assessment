import { api } from "../lib/api";
import { useAppStore } from "../store/useAppStore";
import type { Appointment, SlotsByDate } from "../types/appointment";
import { todayISO } from "../lib/utils";

// API response structure from backend
type AvailableResp = {
  weekStart: string; // "YYYY-MM-DD"
  slotsByDate: SlotsByDate[];
};

export function useAppointments() {
  const {
    setAvailableSlots,
    setAppointments,
    setLoadingSlots,
    setLoadingAppointments,
    setBooking,
    setDeleting,
    pushToast,
    setSelectedDate,
    setSelectedSlot,
  } = useAppStore();

  /**
   * Fetch available slots for the given week.
   * Groups slots by date (Mon–Fri) and ensures selectedDate is valid.
   */
  const refreshSlots = async (weekStartISODate?: string) => {
    setLoadingSlots(true);
    try {
      const url = weekStartISODate
        ? `/appointments/available?weekStart=${encodeURIComponent(
            weekStartISODate
          )}`
        : `/appointments/available`;

      const { data } = await api.get<AvailableResp>(url);
      console.log("🗓️ Available slots data:", data);

      const available = data.slotsByDate || [];
      setAvailableSlots(available);

      // ✅ Normalize today's date to local YYYY-MM-DD
      const today = todayISO();

      // Find matching date ignoring timezone drift
      const todayExists = available.some((day) => {
        const d = new Date(day.date);
        const local = d.toISOString().slice(0, 10);
        return local === today || day.date === today;
      });

      // ✅ Ensure a valid selectedDate is always set
      if (todayExists) {
        setSelectedDate(today);
      } else if (available.length > 0) {
        setSelectedDate(available[0].date);
      } else {
        setSelectedDate("");
      }

      setSelectedSlot(null);
    } catch (error: any) {
      console.error("❌ Failed to fetch slots:", error);
      pushToast({
        title: "Failed to load available slots",
        kind: "error",
      });
    } finally {
      setLoadingSlots(false);
    }
  };

  /**
   * Fetch all existing booked appointments.
   */
  const refreshAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const { data } = await api.get<Appointment[]>("/appointments");
      setAppointments(data);
    } catch (error: any) {
      pushToast({
        title:
          error?.response?.data?.error ||
          "Failed to load booked appointments",
        kind: "error",
      });
    } finally {
      setLoadingAppointments(false);
    }
  };

  /**
   * Create a new appointment (book a slot).
   */
  const book = async (payload: {
    startsAt: string;
    name: string;
    email: string;
    phone?: string;
    reason?: string;
  }) => {
    setBooking(true);
    try {
      await api.post("/appointments", payload);
      pushToast({ title: "✅ Appointment booked!", kind: "success" });
      await Promise.all([refreshSlots(), refreshAppointments()]);
    } catch (error: any) {
      pushToast({
        title: error?.response?.data?.error || "Booking failed",
        kind: "error",
      });
      throw error;
    } finally {
      setBooking(false);
    }
  };

  /**
   * Cancel an appointment by ID.
   */
  const cancel = async (id: string) => {
    setDeleting(id, true);
    try {
      await api.delete(`/appointments/${id}`);
      pushToast({ title: "Appointment cancelled", kind: "success" });
      await Promise.all([refreshSlots(), refreshAppointments()]);
    } catch (error: any) {
      pushToast({
        title: error?.response?.data?.error || "Cancel failed",
        kind: "error",
      });
    } finally {
      setDeleting(id, false);
    }
  };

  return { refreshSlots, refreshAppointments, book, cancel };
}
