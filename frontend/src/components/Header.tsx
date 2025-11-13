import React from "react";
import Logo from "../assets/logo.png";

type TabButtonProps = {
  type: "book" | "view";
  label: string;
  onClick?: () => void;
};

const TabButtons: React.FC<TabButtonProps> = ({ type, label, onClick }) => {
  const bgColor = type === "book" ? "bg-red-500" : "bg-[#1f2f5f]";
  const hoverColor = type === "book" ? "hover:bg-red-600" : "hover:bg-blue-600";

  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-full text-white font-medium transition-all ${bgColor} ${hoverColor}`}
    >
      {label}
    </button>
  );
};

type HeaderProps = {
  setActiveTab: (tab: "Book Slot" | "View Bookings") => void;
};

const Header: React.FC<HeaderProps> = ({ setActiveTab }) => {
  return (
    <div className="p-4 bg-gray-200 w-full h-18 flex justify-between items-center shadow-sm">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setActiveTab("Book Slot")}
      >
        <img src={Logo} alt="Logo" className="w-10 h-10 rounded-full" />

        <p className="font-semibold text-xl text-gray-800">Slotify</p>
      </div>

      <div className="flex gap-2 items-center">
        <TabButtons
          type="book"
          label="Book Slot"
          onClick={() => setActiveTab("Book Slot")}
        />
        <TabButtons
          type="view"
          label="View Bookings"
          onClick={() => setActiveTab("View Bookings")}
        />
      </div>
    </div>
  );
};

export default Header;
