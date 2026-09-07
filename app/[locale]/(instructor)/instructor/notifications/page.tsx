import { Link } from "@/src/i18n/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  MailCheck,
  ShieldCheck,
} from "lucide-react";

import {
  getMyNotifications,
  type ApiNotification,
} from "@/lib/api/notifications";

import { markInstructorNotificationsRead } from "@/app/instructor/actions";

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
    "You have a new update on your instructor account."
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

function iconOf(notification: ApiNotification) {
  const key = `${notification.type ?? ""} ${titleOf(notification)}`;
  if (/payment|wallet|withdraw/i.test(key)) return CircleDollarSign;
  if (/accept|approve|complete/i.test(key)) return CheckCircle2;
  if (/project|order/i.test(key)) return BriefcaseBusiness;
  if (/verify|credential/i.test(key)) return BadgeCheck;
  return MailCheck;
}

export default async function NotificationsPage() {
  const notifications = await getMyNotifications();
  const unread = notifications.filter((notification) => !isRead(notification)).length;

  return (
    <div className="min-h-screen bg-[#f5f7fc] px-4 py-7 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/instructor/tasks"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <header className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-normal text-slate-950 sm:text-5xl">
              Notifications
            </h1>
            <p className="mt-4 text-lg font-medium text-slate-600">
              {unread > 0
                ? `${unread} unread updates about your tasks and earnings.`
                : "Stay updated with your tasks and earnings."}
            </p>
          </div>

          <form action={markInstructorNotificationsRead}>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[#142235] px-6 text-sm font-black text-white transition-colors hover:bg-[#0f1a2a]"
            >
              Mark all read
            </button>
          </form>
        </header>

        <section className="mt-12 space-y-6" aria-label="Notifications list">
          {notifications.map((notification) => {
            const Icon = iconOf(notification);
            const read = isRead(notification);

            return (
              <article
                key={idOf(notification)}
                className={[
                  "relative rounded-xl bg-white p-7 shadow-sm ring-1 ring-slate-100",
                  !read ? "border-l-4 border-[#52bce3]" : "",
                ].join(" ")}
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#dff1ff] text-[#142235]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-xl font-black text-slate-950">
                        {titleOf(notification)}
                      </h2>
                      {!read && (
                        <span className="rounded-full bg-[#dff1ff] px-3 py-1 text-xs font-black text-[#037da9]">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-base font-medium leading-6 text-slate-600">
                      {bodyOf(notification)}
                    </p>
                    <p className="mt-3 text-sm font-bold text-slate-400">
                      {timeOf(notification)}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}

          {notifications.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-100">
              No notifications yet.
            </div>
          )}
        </section>

        <div className="mt-8 flex justify-center text-sm font-bold text-slate-400">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Secure notification center
          </span>
        </div>
      </div>
    </div>
  );
}
