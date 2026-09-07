"use client";

import { useActionState, useRef, useState, Suspense } from "react";
import { Link } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Video, Radio, Upload, X, FileText, CheckCircle2 } from "lucide-react";

import { createStudentRequest, type UploadRequestState } from "../actions";

const initialState: UploadRequestState = {};

function LectureUploadContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "video";
  const isLive = type === "live";

  const [state, formAction, pending] = useActionState(
    createStudentRequest,
    initialState,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [subject, setSubject] = useState("");
  const [major, setMajor] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");

  const syncFileInput = (nextFiles: File[]) => {
    const input = fileInputRef.current;
    if (!input) return;

    const transfer = new DataTransfer();
    for (const file of nextFiles) {
      transfer.items.add(file);
    }
    input.files = transfer.files;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => {
      const next = [...prev, ...dropped];
      syncFileInput(next);
      return next;
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const removeFile = (index: number) =>
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      syncFileInput(next);
      return next;
    });

  return (
    <div className="min-h-screen" style={{ background: "#F6F7F8" }}>
      <div className="container mx-auto px-6 py-12 max-w-2xl">

        {/* Back */}
        <Link
          href="/upload"
          className="inline-flex items-center gap-1 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: "#162535", opacity: 0.5 }}
        >
          <ChevronLeft size={16} />
          Back
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#162535", color: "#5CC0D6" }}
          >
            {isLive ? <Radio size={26} /> : <Video size={26} />}
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#162535" }}>
              Lecture Upload
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#5CC0D6" }}>
              {isLive ? "Explanation by Live" : "Explanation by Video"}
            </p>
          </div>
        </div>

        <form action={formAction} className="flex flex-col gap-6">
          <input type="hidden" name="type" value={isLive ? "live" : "video"} />
          <input type="hidden" name="successType" value="lecture" />

          {/* Subject Input */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#162535" }}>
              Subject / Course Name <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Calculus II, Data Structures..."
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "#fff",
                border: "1.5px solid #E5E7EB",
                color: "#162535",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#5CC0D6")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#162535" }}>
              Major ID <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              name="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="Paste backend major id"
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "#fff",
                border: "1.5px solid #E5E7EB",
                color: "#162535",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#5CC0D6")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#162535" }}>
              Deadline
              <span className="font-normal ml-1" style={{ color: "#667085" }}>(optional)</span>
            </label>
            <input
              type="date"
              name="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "#fff",
                border: "1.5px solid #E5E7EB",
                color: "#162535",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#5CC0D6")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>

          {/* File Drop Zone */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#162535" }}>
              Upload Files <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className="relative rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-3 transition-all cursor-pointer"
              style={{
                borderColor: dragActive ? "#5CC0D6" : "#E5E7EB",
                background: dragActive ? "rgba(92,192,214,0.05)" : "#fff",
              }}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                ref={fileInputRef}
                name="demoFiles"
                type="file"
                multiple
                className="hidden"
                accept=".mp4,.pdf,.docx,.pptx,.zip"
                onChange={handleFileInput}
              />
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(92,192,214,0.1)", color: "#5CC0D6" }}
              >
                <Upload size={26} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm" style={{ color: "#162535" }}>
                  Drag & drop files here
                </p>
                <p className="text-xs mt-1" style={{ color: "#667085" }}>
                  or click to browse — MP4, PDF, DOCX, PPTX, ZIP (Max 500MB)
                </p>
              </div>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="flex flex-col gap-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "#fff", border: "1px solid #E5E7EB" }}
                >
                  <FileText size={18} style={{ color: "#5CC0D6" }} />
                  <span className="flex-1 text-sm truncate" style={{ color: "#162535" }}>
                    {file.name}
                  </span>
                  <span className="text-xs shrink-0" style={{ color: "#667085" }}>
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="p-1 rounded-full hover:opacity-70 transition-opacity"
                    style={{ color: "#EF4444" }}
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#162535" }}>
              Additional Notes
              <span className="font-normal ms-1" style={{ color: "#667085" }}>(optional)</span>
            </label>
            <textarea
              name="description"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific topics or focus areas you'd like covered..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all"
              style={{
                background: "#fff",
                border: "1.5px solid #E5E7EB",
                color: "#162535",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#5CC0D6")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>

          {state.message && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {state.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={pending || !files.length || !subject || !major}
            className="w-full py-4 rounded-full font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
            style={{ background: pending ? "#667085" : "#5CC0D6" }}
          >
            {pending ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Submit for Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LectureUploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm" style={{ color: "#667085" }}>Loading...</div>}>
      <LectureUploadContent />
    </Suspense>
  );
}
