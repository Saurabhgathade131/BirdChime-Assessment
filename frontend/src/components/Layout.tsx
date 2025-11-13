
import type { ReactNode } from "react";
import Toast from "./Toast";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-semibold text-blue-700">Booking App</div>
          <div className="text-sm text-gray-500">Mon–Fri • 9:00–17:00 • 30 min</div>
        </div>
      </nav>
      <main className="w-full mx-auto px-4 py-6">{children}</main>
      <Toast />
    </div>
  );
}
