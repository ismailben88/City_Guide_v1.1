import { useState } from "react";
import { TYPE_META, FALLBACK_META } from "../constants";
import { formatRelative, avatarInitials } from "../utils";
import { XIcon } from "./icons";

export default function NotificationItem({ notif, onRead, onDelete }) {
  const meta = TYPE_META[notif.type] ?? FALLBACK_META;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete();
  };

  return (
    <div
      className={`
        group relative flex items-start gap-3 rounded-2xl border px-4 py-3.5 mb-2
        transition-all duration-200
        ${deleting ? "scale-95 opacity-0 pointer-events-none" : "scale-100 opacity-100"}
        ${
          notif.isRead
            ? "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
            : "border-[#5b8523]/20 bg-[#f8fdf3] shadow-sm hover:shadow-md hover:border-[#5b8523]/30"
        }
      `}
    >
      {/* Unread indicator */}
      <span
        className={`mt-[18px] h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
          notif.isRead ? "bg-gray-200" : meta.dot
        }`}
      />

      {/* Avatar */}
      <div
        className={`
          flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
          text-xs font-bold ring-2 ring-offset-1
          ${notif.isRead ? "bg-gray-100 text-gray-500 ring-gray-100" : `${meta.bg} ${meta.text} ${meta.ring}`}
        `}
      >
        {avatarInitials(notif.senderId)}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm leading-snug ${
              notif.isRead
                ? "font-normal text-gray-600"
                : "font-semibold text-gray-900"
            }`}
          >
            {notif.title}
          </p>
          {/* Type badge */}
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${meta.bg} ${meta.text}`}
          >
            {meta.icon} {meta.label}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
          {notif.message}
        </p>

        {/* Footer row */}
        <div className="mt-2 flex items-center gap-3">
          <span className="text-[11px] text-gray-400">
            {formatRelative(notif.createdAt)}
          </span>

          {!notif.isRead && (
            <>
              <span className="text-gray-200">·</span>
              <button
                onClick={onRead}
                className="text-[11px] font-medium text-[#5b8523] hover:underline transition-colors"
              >
                Marquer comme lu
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delete button — visible on hover */}
      <button
        onClick={handleDelete}
        aria-label="Supprimer"
        className="
          absolute right-3 top-3 flex h-6 w-6 items-center justify-center
          rounded-lg border border-gray-200 bg-white text-gray-400
          opacity-0 shadow-sm transition-all duration-150
          hover:border-red-200 hover:bg-red-50 hover:text-red-500
          group-hover:opacity-100
        "
      >
        <XIcon />
      </button>
    </div>
  );
}
