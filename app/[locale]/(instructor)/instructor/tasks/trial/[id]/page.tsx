export const dynamic = "force-dynamic";

import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  CalendarDays, 
  FileText, 
  Eye, 
  Download, 
  Film, 
  Info,
  Send
} from "lucide-react";

const getTaskDetails = (id: string) => {
  return {
    id,
    studentName: "A.Amr",
    subject: "Data Structures",
    description: '"Need help understanding linked lists and implementation."',
    deadline: "25 March 2026",
    fileName: "trial_task.pdf",
    fileSize: "2.4 MB",
    fileType: "PDF DOCUMENT",
  };
};

export default function TrialSubmissionDetailsPage({ params }: { params: { id: string } }) {
  const task = getTaskDetails(params.id);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link
          href="/instructor/tasks/trial"
          className="inline-flex items-center text-sm font-medium text-[#1e293b] hover:text-[#0f172a] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 me-2" />
          Back
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-[#111827] mb-3">
            Trial Submission
          </h1>
          <p className="text-gray-600 text-lg">
            Review task requirements and upload your evaluation video.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 flex flex-col gap-6">
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
              <div className="flex items-center gap-2 text-[#111827]">
                <User className="w-6 h-6" />
                <h2 className="text-xl font-bold">Student Information</h2>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Student Name</p>
                  <p className="text-lg font-bold text-[#111827]">{task.studentName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Subject</p>
                  <p className="text-lg font-bold text-[#111827]">{task.subject}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</p>
                <p className="text-[#334155] font-medium">{task.description}</p>
              </div>

              <div className="inline-flex items-center gap-2 bg-[#fef2f2] text-[#ef4444] px-4 py-2 rounded-lg w-fit mt-2">
                <CalendarDays className="w-4 h-4" />
                <span className="text-sm font-bold">Deadline: {task.deadline}</span>
              </div>
            </div>

            <div className="bg-[#f1f5f9] rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col gap-6">
              <div className="flex items-center gap-2 text-[#111827]">
                <FileText className="w-6 h-6" />
                <h2 className="text-xl font-bold">Resources</h2>
              </div>

              <div className="bg-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-gray-100">
                <div className="flex gap-4 items-center w-full">
                  <div className="w-12 h-12 bg-[#fee2e2] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[#ef4444] font-bold text-xs border-2 border-[#ef4444] rounded px-1">PDF</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-[#111827] font-bold text-md truncate">{task.fileName}</h4>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                      {task.fileType} • {task.fileSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] font-bold py-2.5 px-4 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    View File
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#64748b] hover:bg-[#475569] text-white font-bold py-2.5 px-4 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
            
          </div>

          <div className="flex-1 lg:max-w-[450px]">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">Upload Trial Video</h3>
                <p className="text-sm text-gray-600">Please provide a 5-minute explanation video.</p>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-[#f8fafc] hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-105 transition-transform border border-gray-100">
                  <Film className="w-8 h-8 text-[#64748b]" />
                </div>
                <h4 className="text-[#111827] font-bold mb-1">Drag & Drop Trial Video</h4>
                <p className="text-xs text-gray-500 mb-6">MP4 or MOV files supported (Max 500MB)</p>
                <button className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] font-bold py-2 px-6 rounded-lg transition-colors text-sm">
                  Browse Files
                </button>
              </div>

              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 flex gap-3 items-start">
                <Info className="w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#14532d] leading-relaxed">
                  Ensure your audio is clear and the implementation of linked lists is explained effectively as per the student&apos;s request.
                </p>
              </div>

              <Link 
                href="/instructor/tasks/trial/success"
                className="w-full bg-[#111827] hover:bg-[#1f2937] text-white font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
              >
                Submit Trial
                <Send className="w-4 h-4 ms-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
