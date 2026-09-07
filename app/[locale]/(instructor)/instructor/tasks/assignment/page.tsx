import { Link } from "@/src/i18n/navigation";
import { ArrowLeft, Calendar, FileText } from "lucide-react";

import { getAllRequests, type ApiRequestItem } from "@/lib/api/requests";

import { OfferSubmitForm } from "../OfferSubmitForm";

function idOf(request: ApiRequestItem) {
  return request._id ?? request.id ?? "";
}

function displayMajor(major: ApiRequestItem["major"]) {
  if (typeof major === "string") return major;
  return major?.name ?? major?.title ?? "General";
}

export default async function AssignmentTaskPage() {
  const requests = (await getAllRequests()).filter(
    (request) => request.type === "assignment" || !request.type,
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <Link
          href="/instructor/tasks"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-[#111827] mb-3">
            Assignment Tasks
          </h1>
          <p className="text-gray-600 text-lg">
            Browse student assignments and submit your offer.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {requests.map((task) => {
            const id = idOf(task);
            return (
              <div
                key={id || task.title}
                className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 flex flex-col gap-8 transition-shadow hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#e0f2fe] text-[#0369a1] font-bold flex items-center justify-center text-lg">
                      {(task.title ?? "A").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-[#111827] font-bold text-lg">
                        Student Request
                      </h3>
                      <p className="text-gray-500 text-sm">{displayMajor(task.major)}</p>
                    </div>
                  </div>
                  <div className="bg-[#e0f2fe] text-[#0369a1] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
                    Assignment
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="max-w-xl">
                    <p className="text-xs font-bold text-[#0369a1] uppercase tracking-wider mb-1">
                      Subject
                    </p>
                    <h2 className="text-2xl font-bold text-[#111827] mb-3">
                      {task.title ?? "Assignment request"}
                    </h2>
                    <p className="text-[#475569] leading-relaxed text-[15px]">
                      {task.description ?? "No description provided."}
                    </p>
                  </div>
                  <div className="text-left md:text-right flex flex-col items-start md:items-end justify-center">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <p className="text-3xl font-black text-[#52bce3] mb-4">
                      {task.status ?? "open"}
                    </p>
                    <div className="flex items-center gap-2 bg-[#f1f5f9] text-[#475569] px-4 py-2 rounded-md text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      Deadline:{" "}
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "Flexible"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-2">
                  <div className="flex items-center justify-between w-full md:w-auto md:min-w-[350px] bg-[#f0f9ff] rounded-2xl p-3 pr-6 border border-[#e0f2fe]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#fee2e2] rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-[#ef4444]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#111827] text-sm mb-0.5">
                          Attached materials
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          Files submitted with request
                        </p>
                      </div>
                    </div>
                  </div>

                  {id && (
                    <OfferSubmitForm
                      requestId={id}
                      label="Confirm"
                      compact
                      successPath="/instructor/tasks/assignment/success"
                    />
                  )}
                </div>
              </div>
            );
          })}

          {requests.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
              No available assignment requests right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
