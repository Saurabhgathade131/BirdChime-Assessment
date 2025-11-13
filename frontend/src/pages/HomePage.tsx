import { useEffect, useState } from "react";
import CalendarTabs from "../components/CalendarTabs";
import CalendarSlots from "../components/CalendarSlots";
import BookingFormPanel from "../components/BookingFormPanel";
import AppointmentList from "../components/AppointmentList";
import { useAppStore } from "../store/useAppStore";
import { useAppointments } from "../hooks/useAppointments";
import Header from "../components/Header";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Book Slot");
  const {
    availableSlots,
    selectedDate,
    setSelectedDate,
    setSelectedSlot,
  } = useAppStore();
  const { refreshSlots } = useAppointments();
  console.log("qwer", availableSlots);

  useEffect(() => {
    refreshSlots();
  }, []);

  const currentDay = availableSlots.find((d) => d.date === selectedDate);
  const slots = currentDay?.slots || [];
  console.log("111", slots);

  return (
    <div className="relative">
      <Header setActiveTab={setActiveTab} />
      <div className="flex">
        <div className="flex-1 p-6">
          {activeTab === "Book Slot" ? (
            <div className="flex flex-col gap-2">
              <CalendarTabs
                selectedDate={selectedDate}
                onSelectDate={(d: string) => {
                  setSelectedDate(d);
                  setSelectedSlot(null);
                }}
              />
              <CalendarSlots slots={slots} onSelectSlot={setSelectedSlot} />
            </div>
          ) : (
            <AppointmentList />
          )}
        </div>

        {/* Booking form slides in on right side */}
        <BookingFormPanel />
      </div>
    </div>
  );
}
