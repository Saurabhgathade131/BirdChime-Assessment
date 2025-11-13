import { useEffect } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { useAppStore } from "../store/useAppStore";
import { fmtTime, fmtSlot } from "../lib/utils";

export default function AppointmentList() {
  const { refreshAppointments, cancel } = useAppointments();
  const { appointments, loadingAppointments, deleting } = useAppStore();

  useEffect(() => {
    refreshAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">All Appointments</h2>
      {loadingAppointments ? (
        <div className="text-gray-500">Loading appointments…</div>
      ) : appointments.length === 0 ? (
        <div className="text-gray-500">No bookings yet.</div>
      ) : (
        <ul className="space-y-4">
          {appointments.map((a) => (
            <li
              key={a._id}
              className="bg-white border rounded-md p-4 flex items-center justify-between shadow-sm"
            >
              <div>
                <div className="font-medium text-gray-800">
                  {fmtSlot(a.startsAt)} – {fmtTime(a.endsAt)}
                </div>
                <div className="text-sm text-gray-600">
                  {a.name} • {a.email}
                  {a.reason ? ` • ${a.reason}` : ""}
                </div>
              </div>

              {/* Tailwind-only Cancel Button */}
              <button
                onClick={() => cancel(a._id)}
                disabled={!!deleting[a._id]}
                className="w-[150px] ml-4 bg-[#ff6b6b] text-white font-medium py-2 px-3 rounded-md transition-colors duration-200 ease-in-out hover:bg-[#ff5252] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting[a._id] ? "Cancelling…" : "Cancel Booking"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
