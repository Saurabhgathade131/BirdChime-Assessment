import { format, addDays, startOfWeek } from "date-fns";

export default function CalendarTabs({ selectedDate, onSelectDate }: any) {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const week = Array.from({ length: 5 }, (_, i) => addDays(start, i));

  return (
    <div className="overflow-x-auto pb-2 pt-2">
      <div className="flex gap-2">
        {week.map((date) => {
          const iso = format(date, "yyyy-MM-dd");
          const isActive = iso === selectedDate;
          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl transition-all shadow p-4 min-w-24 min-h-16 text-md ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white border hover:bg-gray-100 text-grayText text-sm"
              }`}
            >
              <div className="font-medium">{format(date, "EEE")}</div>
              <div className="text-xs">{format(date, "dd MMM")}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
