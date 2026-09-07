import { Link } from "@/src/i18n/navigation";
import { ArrowLeft, FileText, ArrowRight } from "lucide-react";

import { getAllRequests, type ApiRequestItem } from "@/lib/api/requests";

import { OfferSubmitForm } from "../OfferSubmitForm";

function idOf(request: ApiRequestItem) {
  return request._id ?? request.id ?? "";
}

function displayMajor(major: ApiRequestItem["major"]) {
  if (typeof major === "string") return major;
  return major?.name ?? major?.title ?? "General";
}

export default async function TrialTaskPage() {
  const requests = (await getAllRequests()).filter(
    (request) => !request.type || request.type === "trial",
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link
          href="/instructor/tasks"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-[#111827] mb-3">
            Trial Tasks
          </h1>
          <p className="text-gray-600 text-lg">
            Browse available student requests and submit your offer.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-6">
            {requests.map((task) => {
              const id = idOf(task);
              return (
                <div
                  key={id || task.title}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-[#e0f2fe] text-[#0369a1] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {task.type ?? "Trial Request"}
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                        Deadline
                      </p>
                      <p className="text-sm font-medium text-[#111827]">
                        {task.deadline
                          ? new Date(task.deadline).toLocaleDateString()
                          : "Flexible"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <h2 className="text-2xl font-bold text-[#111827] mb-4">
                      {task.title ?? "Student request"}
                    </h2>
                    <h3 className="text-lg font-bold text-[#334155] mb-2">
                      {displayMajor(task.major)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {task.description ?? "No description provided."}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                    <div className="flex items-center gap-2 bg-[#f1f5f9] px-4 py-2.5 rounded-lg w-full sm:w-auto">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-[#334155] truncate max-w-[240px]">
                        Attached materials
                      </span>
                    </div>
                    {id && (
                      <OfferSubmitForm
                        requestId={id}
                        label="Submit Offer"
                        compact
                        successPath="/instructor/tasks/trial/success"
                      />
                    )}
                  </div>
                </div>
              );
            })}

            {requests.length === 0 && (
              <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
                No available trial requests right now.
              </div>
            )}
          </div>

          <div className="w-full lg:w-[350px]">
            <div className="bg-[#1e293b] rounded-2xl p-8 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-white mb-3">
                Priority Support
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Facing issues with a student submission? Our academic coordinators
                are here to help 24/7.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-sm font-bold text-white hover:text-gray-300 transition-colors"
              >
                Contact Support
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
