import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  Eye,
  FileText,
  Info,
  Send,
  Upload,
  User,
} from "lucide-react";

type PageParams = Promise<{
  id: string;
}>;

type LiveSubmission = {
  id: string;
  studentName: string;
  subject: string;
  description: string;
  deadline: string;
  fileName: string;
  fileSize: string;
  fileType: string;
};

const LIVE_SUBMISSIONS: LiveSubmission[] = [
  {
    id: "data-structures",
    studentName: "A.Amr",
    subject: "Data Structures",
    description: '"Need help understanding linked lists and implementation."',
    deadline: "25 March 2026",
    fileName: "trial_task.pdf",
    fileSize: "2.4 MB",
    fileType: "PDF DOCUMENT",
  },
  {
    id: "software-architecture",
    studentName: "S.Ahmed",
    subject: "Software Architecture",
    description:
      '"Reviewing microservices architecture patterns and event-driven systems."',
    deadline: "28 March 2026",
    fileName: "architecture_review_draft.pdf",
    fileSize: "1.8 MB",
    fileType: "PDF DOCUMENT",
  },
  {
    id: "linear-algebra",
    studentName: "O.Mohamed",
    subject: "Linear Algebra",
    description:
      '"Working through vector spaces and transformation matrices."',
    deadline: "02 April 2026",
    fileName: "math_problem_set_01.pdf",
    fileSize: "3.1 MB",
    fileType: "PDF DOCUMENT",
  },
];

function getSubmission(id: string) {
  return LIVE_SUBMISSIONS.find((submission) => submission.id === id);
}

export default async function LiveSubmissionPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const submission = getSubmission(id);

  if (!submission) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f5f7fc] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/instructor/tasks/explain?mode=live"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <header className="mt-8">
          <h1 className="text-4xl font-black tracking-normal text-slate-950">
            Trial Submission
          </h1>
          <p className="mt-4 text-base font-medium text-slate-600">
            Review task requirements and upload your evaluation video.
          </p>
        </header>

        <main className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
          <section className="space-y-8">
            <StudentInformation submission={submission} />
            <ResourcesCard submission={submission} />
          </section>

          <UploadTrialVideo />
        </main>
      </div>
    </div>
  );
}

function StudentInformation({ submission }: { submission: LiveSubmission }) {
  return (
    <article className="rounded-xl bg-white p-7 shadow-sm ring-1 ring-slate-100 sm:p-8">
      <div className="flex items-center gap-2 text-slate-950">
        <User className="h-5 w-5" />
        <h2 className="text-xl font-black">Student Information</h2>
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <InfoItem label="Student Name" value={submission.studentName} />
        <InfoItem label="Subject" value={submission.subject} />
      </div>

      <div className="mt-8">
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
          Description
        </p>
        <p className="mt-3 text-base font-medium leading-7 text-slate-700">
          {submission.description}
        </p>
      </div>

      <div className="mt-8 inline-flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm font-black text-red-600">
        <CalendarDays className="h-4 w-4" />
        Deadline: {submission.deadline}
      </div>
    </article>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function ResourcesCard({ submission }: { submission: LiveSubmission }) {
  return (
    <article className="rounded-xl bg-[#e8f2ff] p-7 shadow-sm sm:p-8">
      <div className="flex items-center gap-2 text-slate-950">
        <FileText className="h-5 w-5" />
        <h2 className="text-xl font-black">Resources</h2>
      </div>

      <div className="mt-6 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <span className="rounded border-2 border-red-500 px-1 text-[11px] font-black">
                PDF
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-slate-950">
                {submission.fileName}
              </h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                {submission.fileType} - {submission.fileSize}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#d8eaff] px-5 text-sm font-black text-slate-700 transition-colors hover:bg-[#c9e1ff]"
            >
              <Eye className="h-4 w-4" />
              View File
            </button>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-500 px-5 text-sm font-black text-white transition-colors hover:bg-slate-600"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function UploadTrialVideo() {
  return (
    <aside className="rounded-xl bg-white p-7 shadow-sm ring-1 ring-slate-100 sm:p-8 lg:self-start">
      <h2 className="text-xl font-black text-slate-950">Upload Trial Video</h2>
      <p className="mt-2 text-sm font-medium text-slate-600">
        Please provide a 5-minute explanation video.
      </p>

      <div className="mt-8 rounded-xl border-2 border-dashed border-slate-200 bg-white p-8 text-center transition-colors hover:bg-slate-50">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f2ff] text-slate-700">
          <Upload className="h-7 w-7" />
        </div>
        <h3 className="mt-8 text-base font-black text-slate-950">
          Drag & Drop Trial Video
        </h3>
        <p className="mt-2 text-xs font-medium text-slate-500">
          MP4 or MOV files supported (Max 500MB)
        </p>
        <button
          type="button"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#cfe3ff] px-8 text-sm font-black text-slate-700 transition-colors hover:bg-[#bdd8fa]"
        >
          Browse Files
        </button>
      </div>

      <div className="mt-8 flex gap-3 rounded-lg bg-[#eef9ff] p-4 text-start">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />
        <p className="text-sm font-medium leading-6 text-slate-700">
          Ensure your audio is clear and the implementation of linked lists is
          explained effectively as per the student&apos;s request.
        </p>
      </div>

      <Link
        href="/instructor/tasks/explain/live/success"
        className="mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#142235] text-base font-black text-white shadow-[0_14px_22px_rgba(15,23,42,0.22)] transition-colors hover:bg-[#0f1a2a]"
      >
        Submit Trial
        <Send className="h-5 w-5" />
      </Link>
    </aside>
  );
}
