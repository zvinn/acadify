import { CalendarClock, MessageSquare, ShieldCheck } from "lucide-react";

import Navbar from "@/app/components/Navbar";
import { getAllChats, getChatMessages, getUserChats, type ApiChat, type ApiMessage } from "@/lib/api/chats";
import { idOf, recordOf, textOf } from "@/lib/api/response";
import { getSession } from "@/lib/auth/session";
import { Link } from "@/src/i18n/navigation";

export const dynamic = "force-dynamic";

function referenceIds(chat: ApiChat) {
  const order = recordOf(chat.order);
  const request = recordOf(chat.request);
  return new Set([
    idOf(chat),
    textOf(chat.referenceId),
    idOf(chat.order),
    idOf(chat.request),
    idOf(order.request),
    idOf(request.order),
  ].filter(Boolean));
}

function senderName(message: ApiMessage) {
  const sender = recordOf(message.sender);
  return textOf(
    sender.fullName,
    textOf(sender.name, textOf(sender.email, textOf(message.sender, "Acadify user"))),
  );
}

function messageText(message: ApiMessage) {
  return textOf(message.content, textOf(message.body, textOf(message.text, "Message")));
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await getSession();
  const role = session?.role ?? "guest";
  const chats = role === "admin" ? await getAllChats() : await getUserChats();
  const chat = chats.find((item) => referenceIds(item).has(orderId));
  const messages = chat ? await getChatMessages(idOf(chat)) : [];
  const orderedMessages = [...messages].sort((left, right) =>
    (left.createdAt ?? "").localeCompare(right.createdAt ?? ""),
  );
  const backHref =
    role === "admin"
      ? "/admin/orders"
      : role === "instructor"
        ? "/instructor/projects"
        : "/orders";

  return (
    <div className="min-h-screen bg-[#F6F7F8]">
      <Navbar role={role} />
      <main className="mx-auto max-w-5xl px-5 pb-12 pt-28">
        <Link href={backHref} className="text-sm font-bold text-[#5CC0D6] hover:text-[#162535]">
          Back to orders
        </Link>

        <section className="mt-5 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          <header className="flex flex-col justify-between gap-4 border-b border-slate-100 px-6 py-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5CC0D6]">Backend chat</p>
              <h1 className="mt-2 text-2xl font-black text-[#162535]">Order conversation</h1>
              <p className="mt-1 text-xs text-slate-400">Reference: {orderId}</p>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
              <ShieldCheck size={16} /> Platform protected
            </span>
          </header>

          {!chat ? (
            <div className="px-6 py-20 text-center">
              <MessageSquare className="mx-auto text-slate-300" size={42} />
              <h2 className="mt-4 text-lg font-black text-[#162535]">No backend chat for this order</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                The backend did not return a conversation whose chat, order, request, or reference ID matches this page.
              </p>
            </div>
          ) : (
            <>
              <div className="min-h-[420px] space-y-4 bg-slate-50/70 px-5 py-7 sm:px-8">
                {orderedMessages.map((message, index) => (
                  <article
                    key={idOf(message) || index}
                    className="max-w-2xl rounded-2xl rounded-tl-sm bg-white px-5 py-4 shadow-sm ring-1 ring-slate-100"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-black text-[#162535]">{senderName(message)}</p>
                      {message.createdAt && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <CalendarClock size={12} /> {formatDate(message.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{messageText(message)}</p>
                  </article>
                ))}
                {orderedMessages.length === 0 && (
                  <p className="py-20 text-center text-sm text-slate-500">This chat has no messages yet.</p>
                )}
              </div>

              <footer className="border-t border-amber-100 bg-amber-50 px-6 py-4 text-sm leading-6 text-amber-800">
                Message history is live. Sending is disabled because the current backend collection exposes chat creation and history, but no send-message endpoint.
              </footer>
            </>
          )}
        </section>
      </main>
    </div>
  );
}