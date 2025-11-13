import { Schema, model } from "mongoose";

const AppointmentSchema = new Schema(
  {
    startsAt: { type: Date, required: true, unique: true },
    endsAt: { type: Date, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: null },
    reason: { type: String, default: null, maxlength: 200 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AppointmentSchema.index({ startsAt: 1 }, { unique: true });

export const Appointment = model("Appointment", AppointmentSchema);
