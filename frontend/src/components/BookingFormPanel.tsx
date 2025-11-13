import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "../store/useAppStore";
import { useAppointments } from "../hooks/useAppointments";
import { fmtSlot } from "../lib/utils";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  reason: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function BookingFormPanel() {
  const { selectedSlot, setSelectedSlot } = useAppStore();
  const { book } = useAppointments();
  const [visible, setVisible] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setVisible(!!selectedSlot);
  }, [selectedSlot]);

  const onSubmit = async (data: FormData) => {
    if (!selectedSlot) return;
    await book({ startsAt: selectedSlot, ...data });
    reset();
    setSelectedSlot(null);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white shadow-lg border-l p-6 slide-in-right ${
        visible ? "active" : ""
      }`}
    >
      {/* Back Button */}
      <button
        onClick={() => setSelectedSlot(null)}
        className="w-[40%] bg-[#ff6b6b] text-white py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-[#ff5252] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        ← Back
      </button>

      {selectedSlot ? (
        <>
          <h2 className="text-lg font-semibold text-grayText mb-2">
            Book Slot
          </h2>
          <p className="text-sm text-graySubtext mb-4">
            {fmtSlot(selectedSlot)}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              {...register("name")}
              placeholder="Name *"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
            />
            <input
              {...register("email")}
              placeholder="Email *"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
            />
            <input
              {...register("phone")}
              placeholder="Phone"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
            />
            <textarea
              {...register("reason")}
              placeholder="Reason (optional)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
            />
            <button
              type="submit"
              className="w-full bg-[#ff6b6b] text-white py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-[#ff5252] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Confirm Booking
            </button>
          </form>
        </>
      ) : (
        <p className="text-graySubtext mt-6">Select a slot to start booking.</p>
      )}
    </div>
  );
}
