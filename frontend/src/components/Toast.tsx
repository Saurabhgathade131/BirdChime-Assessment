import { useAppStore } from "../store/useAppStore";

export default function Toast() {
  const { toasts, removeToast } = useAppStore();
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-[min(92vw,360px)]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "rounded-md shadow-md p-3 border flex items-start justify-between gap-3",
            t.kind === "success" && "bg-green-50 border-green-200 text-green-900",
            t.kind === "error" && "bg-red-50 border-red-200 text-red-900",
            t.kind === "info" && "bg-blue-50 border-blue-200 text-blue-900",
          ].filter(Boolean).join(" ")}
        >
          <div className="text-sm font-medium">{t.title}</div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-xs opacity-70 hover:opacity-100"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
