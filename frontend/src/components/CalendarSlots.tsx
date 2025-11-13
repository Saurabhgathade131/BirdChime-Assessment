import { fmtTime } from "../lib/utils";
import { useAppStore } from "../store/useAppStore";

export default function CalendarSlots({ slots, onSelectSlot }: any) {
  const { selectedSlot } = useAppStore();

  // Determine grid layout dynamically
  const gridCols =
    slots.length <= 2
      ? "grid-cols-2"
      : slots.length <= 4
      ? "grid-cols-2 sm:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-3"; // 5–6 slots = two rows of 3

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Available slots</h3>
        <p className="text-xs text-gray-400">{slots.length} slots</p>
      </div>

      <div className={`grid ${gridCols} gap-4 place-items-center`}>
        {slots.map((slot: string) => {
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              onClick={() => onSelectSlot(slot)}
              className={`flex items-center justify-center w-full h-16 rounded-xl border transition-all duration-150 shadow-sm shadow-[#1f2f5f40]
                ${
                  isSelected
                    ? "bg-primary text-white border-transparent shadow-md scale-[1.02]"
                    : "bg-white text-gray-700 border-gray-200 hover:shadow hover:-translate-y-0.5"
                }
              `}
            >
              <span className="text-sm font-medium">{fmtTime(slot)}</span>
            </button>
          );
        })}
      </div>

      {!slots.length && (
        <div className="mt-6 py-8 flex flex-col items-center justify-center text-center border border-dashed border-gray-100 rounded-lg bg-gray-50">
          <p className="text-gray-500 text-sm">
            No slots available for this date.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Try another date or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
