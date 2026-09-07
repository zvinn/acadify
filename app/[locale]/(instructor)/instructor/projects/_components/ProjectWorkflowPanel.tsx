"use client";

import { useActionState, useEffect, useState } from "react";
import { CalendarPlus, CheckCircle2, FileUp, MessageCircleMore, UploadCloud, Video } from "lucide-react";

import { manageInstructorProject, type ProjectActionState } from "@/app/instructor/project-actions";
import { uploadToPresignedUrl } from "@/lib/api/direct-upload";

const initialState: ProjectActionState = {};

type Props = {
  kind: "assignment" | "video" | "live";
  orderId: string;
  offerId: string;
  requestId: string;
};

const hidden = (props: Props, operation: string) => <><input type="hidden" name="operation" value={operation} /><input type="hidden" name="orderId" value={props.orderId} /><input type="hidden" name="offerId" value={props.offerId} /><input type="hidden" name="requestId" value={props.requestId} /></>;

export function ProjectWorkflowPanel(props: Props) {
  return (
    <section className="mt-8 rounded-3xl bg-[#162535] p-6 text-white shadow-lg sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5CC0D6]">Backend workflow</p>
      <h2 className="mt-2 text-2xl font-black">Deliver this project</h2>
      <p className="mt-2 text-sm leading-6 text-white/60">Every control below calls the matching production endpoint. No local completion state is simulated.</p>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {props.kind === "assignment" ? <AssignmentActions {...props} /> : <OrderDeliveryActions {...props} />}
        {props.kind === "live" && <LiveSessionAction {...props} />}
      </div>
    </section>
  );
}

function Feedback({ state }: { state: ProjectActionState }) {
  if (!state.message) return null;
  return <p className={`mt-3 rounded-xl px-3 py-2 text-xs font-bold ${state.ok ? "bg-emerald-500/15 text-emerald-200" : "bg-red-500/15 text-red-200"}`}>{state.message}</p>;
}

function AssignmentActions(props: Props) {
  return <><FileAction {...props} operation="upload-solution" title="Upload solution files" /><SimpleAction {...props} operation="request-approval" title="Request student approval" icon={CheckCircle2} /><SimpleAction {...props} operation="request-meeting" title="Request a meeting" icon={MessageCircleMore} /><ScheduleMeeting {...props} /></>;
}

function OrderDeliveryActions(props: Props) {
  return <><DirectVideoAction {...props} /><FileAction {...props} operation="upload-documents" title="Upload documents" /><FileAction {...props} operation="upload-quizzes" title="Upload quizzes" /><SimpleAction {...props} operation="submit" title="Submit and finish" icon={CheckCircle2} /></>;
}

function FileAction(props: Props & { operation: string; title: string }) {
  const [state, action, pending] = useActionState(manageInstructorProject, initialState);
  return <form action={action} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">{hidden(props, props.operation)}<FileUp className="text-[#5CC0D6]" size={21} /><h3 className="mt-3 text-sm font-black">{props.title}</h3><input type="file" name="files" multiple required className="mt-4 block w-full text-xs text-white/60 file:mr-3 file:rounded-full file:border-0 file:bg-[#5CC0D6] file:px-4 file:py-2 file:text-xs file:font-black file:text-white" /><button disabled={pending} className="mt-4 rounded-full bg-white px-5 py-2.5 text-xs font-black text-[#162535] disabled:opacity-50">{pending ? "Uploading..." : "Upload"}</button><Feedback state={state} /></form>;
}

function SimpleAction(props: Props & { operation: string; title: string; icon: typeof CheckCircle2 }) {
  const [state, action, pending] = useActionState(manageInstructorProject, initialState);
  const Icon = props.icon;
  return <form action={action} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">{hidden(props, props.operation)}<Icon className="text-[#5CC0D6]" size={21} /><h3 className="mt-3 text-sm font-black">{props.title}</h3><button disabled={pending} className="mt-4 rounded-full bg-[#5CC0D6] px-5 py-2.5 text-xs font-black text-white disabled:opacity-50">{pending ? "Working..." : props.title}</button><Feedback state={state} /></form>;
}

function ScheduleMeeting(props: Props) {
  const [state, action, pending] = useActionState(manageInstructorProject, initialState);
  return <form action={action} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">{hidden(props, "schedule-meeting")}<CalendarPlus className="text-[#5CC0D6]" size={21} /><h3 className="mt-3 text-sm font-black">Schedule meeting</h3><input type="datetime-local" name="time" required className="mt-4 h-11 w-full rounded-xl bg-white px-3 text-xs font-bold text-[#162535]" /><button disabled={pending} className="mt-4 rounded-full bg-[#5CC0D6] px-5 py-2.5 text-xs font-black text-white disabled:opacity-50">{pending ? "Scheduling..." : "Schedule"}</button><Feedback state={state} /></form>;
}

function LiveSessionAction(props: Props) {
  const [state, action, pending] = useActionState(manageInstructorProject, initialState);
  return <form action={action} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 lg:col-span-2">{hidden(props, "create-live")}<CalendarPlus className="text-[#5CC0D6]" size={21} /><h3 className="mt-3 text-sm font-black">Create live session</h3><div className="mt-4 grid gap-3 sm:grid-cols-2"><input type="datetime-local" name="time" required className="h-11 rounded-xl bg-white px-3 text-xs font-bold text-[#162535]" /><input type="number" name="numberOfSessions" min="1" defaultValue="1" className="h-11 rounded-xl bg-white px-3 text-xs font-bold text-[#162535]" /></div><button disabled={pending} className="mt-4 rounded-full bg-[#5CC0D6] px-5 py-2.5 text-xs font-black text-white disabled:opacity-50">{pending ? "Creating..." : "Create session"}</button><Feedback state={state} /></form>;
}

function DirectVideoAction(props: Props) {
  const [state, action, pending] = useActionState(manageInstructorProject, initialState);
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState("");

  useEffect(() => {
    if (!state.uploadUrl || !file) return;
    let active = true;
    uploadToPresignedUrl(state.uploadUrl, file)
      .then(() => active && setUploadState("Video uploaded successfully."))
      .catch((error: unknown) => active && setUploadState(error instanceof Error ? error.message : "Video upload failed."));
    return () => { active = false; };
  }, [state.uploadUrl, file]);

  return <form action={action} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">{hidden(props, "prepare-video")}<Video className="text-[#5CC0D6]" size={21} /><h3 className="mt-3 text-sm font-black">Upload video</h3><input type="file" accept="video/*" required onChange={(event) => { setFile(event.target.files?.[0] ?? null); setUploadState(""); }} className="mt-4 block w-full text-xs text-white/60 file:mr-3 file:rounded-full file:border-0 file:bg-[#5CC0D6] file:px-4 file:py-2 file:text-xs file:font-black file:text-white" /><button onClick={() => setUploadState("Uploading video directly...")} disabled={pending || !file} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-black text-[#162535] disabled:opacity-50"><UploadCloud size={15} /> {pending ? "Preparing..." : "Start upload"}</button><Feedback state={state} />{uploadState && <p className="mt-3 text-xs font-bold text-cyan-100">{uploadState}</p>}</form>;
}
