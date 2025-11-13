import { create } from "zustand";
import type { Appointment, SlotsByDate } from "../types/appointment";

type Toast = { id: string; title: string; kind?: "success" | "error" | "info" };

type AppState = {
  // data
  availableSlots: SlotsByDate[];
  appointments: Appointment[];
  // ui state
  selectedDate: string;         // "YYYY-MM-DD"
  selectedSlot: string | null;  // ISO
  loadingSlots: boolean;
  loadingAppointments: boolean;
  booking: boolean;
  deleting: Record<string, boolean>;
  // toasts
  toasts: Toast[];

  // actions
  setSelectedDate: (d: string) => void;
  setSelectedSlot: (s: string | null) => void;
  setAvailableSlots: (s: SlotsByDate[]) => void;
  setAppointments: (a: Appointment[]) => void;
  setLoadingSlots: (v: boolean) => void;
  setLoadingAppointments: (v: boolean) => void;
  setBooking: (v: boolean) => void;
  setDeleting: (id: string, v: boolean) => void;

  pushToast: (t: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  availableSlots: [],
  appointments: [],
  selectedDate: "",  // set on load
  selectedSlot: null,
  loadingSlots: false,
  loadingAppointments: false,
  booking: false,
  deleting: {},
  toasts: [],

  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSelectedSlot: (selectedSlot) => set({ selectedSlot }),
  setAvailableSlots: (availableSlots) => set({ availableSlots }),
  setAppointments: (appointments) => set({ appointments }),
  setLoadingSlots: (loadingSlots) => set({ loadingSlots }),
  setLoadingAppointments: (loadingAppointments) => set({ loadingAppointments }),
  setBooking: (booking) => set({ booking }),
  setDeleting: (id, v) => set({ deleting: { ...get().deleting, [id]: v } }),

  pushToast: ({ title, kind = "info" }) => {
    const id = crypto.randomUUID();
    const t = { id, title, kind };
    set({ toasts: [t, ...get().toasts].slice(0, 5) });
    setTimeout(() => {
      const found = get().toasts.find((x) => x.id === id);
      if (found) get().removeToast(id);
    }, 3500);
  },
  removeToast: (id) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
