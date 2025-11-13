// backend/src/schemas/appointments.ts
import { z } from "zod";

export const CreateAppointmentSchema = z.object({
  startsAt: z.string().datetime(), // ISO string
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  phone: z.string().max(24).optional().nullable(),
  reason: z.string().max(200).optional().nullable()
});
