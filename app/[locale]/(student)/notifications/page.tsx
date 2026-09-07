import { Link } from "@/src/i18n/navigation";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronLeft,
  Info,
} from "lucide-react";

import {
  getMyNotifications,
  type ApiNotification,
} from "@/lib/api/notifications";

import { markStudentNotificationsRead } from "../orders/actions";

function idOf(notification: ApiNotification) {
  return notification._id ?? notification.id ?? notification.createdAt ?? "";
}

function titleOf(notification: ApiNotification) {
  return notification.title ?? notification.type ?? "Notification";
}

function bodyOf(notification: ApiNotification) {
  return (
    notification.body ??
    notification.description ??
    "You have a new update on your account."
  );
}

function isRead(notification: ApiNotification) {
  return Boolean(notification.isRead || notification.readAt);
}

function timeOf(notification: ApiNotification) {
  return notification.createdAt
    ? new Date(notification.createdAt).toLocaleString()
    : "Just now";
}

function notificationIcon(type: string | undefined) {
  if (/alert|warning|payment/i.test(type ?? "")) return AlertCircle;
  if (/success|accept|complete|grade/i.test(type ?? "")) return CheckCircle2;
  return Info;
}

function notificationTone(type: string | undefined) {
  if (/alert|warning|payment/i.test(type ?? "")) {
    return { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" };
  }
  if (/success|accept|complete|grade/i.test(type ?? "")) {
    return { color: "#22C55E", bg: "rgba(34,197,94,0.1)" };
  }
  return { color: "#5CC0D6", bg: "rgba(92,192,214,0.1)" };
}

export default async function NotificationsPage() {
  const notifications = await getMyNotifications();
  const unread = notifications.filter((notification) => !isRead(notification)).length;

  return (
    <div className="min-h-screen" style={{ background: "#F6F7F8" }}>
      <div className="container mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
          style={{ color: "#162535", opacity: 0.5 }}
        >
          <ChevronLeft size={16} />
          Back
        </Link>

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#162535" }}>
              Notifications
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#667085" }}>
              {unread > 0 ? (
                <>
                  You have{" "}
                  <span className="font-semibold" style={{ color: "#5CC0D6" }}>
                    {unread} unread
                  </span>{" "}
                  notifications
                </>
              ) : (
                "All notifications are read"
              )}
            </p>
          </div>

          <form action={markStudentNotificationsRead}>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "#162535" }}
            >
              Mark all read
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-3">
          {notifications.map((notification) => {
            const Icon = notificationIcon(notification.type);
            const tone = notificationTone(notification.type);
            const read = isRead(notification);

            return (
              <article
                key={idOf(notification)}
                className="flex items-start gap-4 rounded-2xl bg-white px-6 py-5 transition-all hover:shadow-sm"
                style={{
                  boxShadow: "0 1px 8px rgba(22,37,53,0.06)",
                  opacity: read ? 0.7 : 1,
                }}
              >
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: tone.bg, color: tone.color }}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h2 className="text-sm font-semibold" style={{ color: "#162535" }}>
                      {titleOf(notification)}
                    </h2>
                    {!read && (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: "#5CC0D6" }}
                      />
                    )}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#667085" }}>
                    {bodyOf(notification)}
                  </p>
                  <p className="mt-2 text-xs" style={{ color: "#9CA3AF" }}>
                    {timeOf(notification)}
                  </p>
                </div>
              </article>
            );
          })}

          {notifications.length === 0 && (
            <div className="rounded-2xl bg-white px-6 py-12 text-center text-sm text-slate-500">
              <Bell className="mx-auto mb-3 h-8 w-8 text-slate-300" />
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
