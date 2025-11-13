// backend/src/routes/appointments.ts
import { Router } from "express";
import { Appointment } from "../db/models/Appointment";
import { validate } from "../middleware/validate";
import { CreateAppointmentSchema } from "../schemas/appointments";
import { isBusinessSlotUTC, isPastUTC, toEndsAtUTC } from "../lib/time";
import { weekSlotsUTC } from "../lib/time";

const appointmentRoute = Router();

appointmentRoute.get("/", async (_req, res) => {
  const data = await Appointment.find().sort({ startsAt: 1 }).lean();
  res.json(data);
});

appointmentRoute.get("/available", async (req, res) => {
  const weekStart = (req.query.weekStart as string) ?? new Date().toISOString().slice(0, 10);
  const start = new Date(weekStart);
  const dow = start.getDay();
  const monday = new Date(start);
  monday.setDate(start.getDate() - ((dow + 6) % 7));

  const allSlots = require("../lib/time").weekSlotsUTC(monday.toISOString());
  const first = allSlots[0];
  const last = allSlots[allSlots.length - 1];

  const booked = await Appointment.find({ startsAt: { $gte: first, $lte: last } }).lean();
  const bookedSet = new Set(booked.map((b) => new Date(b.startsAt).toISOString()));

  const now = Date.now();
  const available = allSlots.filter(
    (s:any) => s.getTime() > now && !bookedSet.has(s.toISOString())
  );

  // Group by date (local day)
  const grouped: Record<string, string[]> = {};
  for (const slot of available) {
    const date = new Date(slot).toISOString().slice(0, 10);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(slot.toISOString());
  }

  const slotsByDate = Object.entries(grouped).map(([date, slots]) => ({ date, slots }));

  res.json({ weekStart, slotsByDate });
});


appointmentRoute.post("/", validate(CreateAppointmentSchema), async (req, res, next) => {
  try {
    const startsAt = new Date(req.body.startsAt);
    if (isPastUTC(startsAt))
      return res.status(400).json({ error: "Cannot book in the past" });
    if (!isBusinessSlotUTC(startsAt))
      return res.status(400).json({ error: "Outside business hours or misaligned slot" });

    const doc = {
      startsAt,
      endsAt: toEndsAtUTC(startsAt),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone ?? null,
      reason: req.body.reason ?? null
    };

    // Will throw on duplicate due to unique index
    const created = await Appointment.create(doc);
    return res.status(201).json(created);
  } catch (e: any) {
    // Handle duplicate slot (Mongo duplicate key error)
    if (e?.code === 11000) {
      return res.status(409).json({ error: "Slot already booked" });
    }
    next(e);
  }
});

appointmentRoute.delete("/:id", async (req, res, next) => {
  try {
    const { deletedCount } = await Appointment.deleteOne({ _id: req.params.id });
    if (!deletedCount) return res.status(404).json({ error: "Not found" });
    return res.status(204).send();
  } catch (e) { next(e); }
});

export default appointmentRoute;
