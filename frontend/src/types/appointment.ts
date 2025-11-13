export interface Appointment {
  _id: string;
  startsAt: string; // ISO
  endsAt: string;   // ISO
  name: string;
  email: string;
  phone?: string | null;
  reason?: string | null;
  createdAt?: string;
}

export interface SlotsByDate {
  date: string;     // "YYYY-MM-DD"
  slots: string[];  // ISO instants for that date
}
