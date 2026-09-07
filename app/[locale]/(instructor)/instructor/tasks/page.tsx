export const dynamic = "force-dynamic";

import Link from "next/link";
import { ClipboardCheck, FileText, GraduationCap } from "lucide-react";

const TASKS_DATA = [
  {
    id: "trial",
    title: "Trial",
    icon: ClipboardCheck,
    buttonText: "Explain",
    href: "/instructor/tasks/trial",
  },
  {
    id: "assignment",
    title: "Assignment",
    icon: FileText,
    buttonText: "Assignments",
    href: "/instructor/tasks/assignment",
  },
  {
    id: "explain",
    title: "Explain",
    icon: GraduationCap,
    buttonText: "Explain",
    href: "/instructor/tasks/explain",
  },
];

export default function InstructorTasksPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#111827] mb-4">Available Tasks</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Select a task type to begin reviewing student submissions or manage direct offers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TASKS_DATA.map((task) => {
          const Icon = task.icon;

          return (
            <div
              key={task.id}
              className="bg-[#1e293b] rounded-xl p-8 flex flex-col items-center justify-between min-h-[300px] shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col items-center gap-6 mt-4">
                <div className="w-16 h-16 bg-[#b6e3f4] rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-[#1e293b]" />
                </div>
                
                <h3 className="text-2xl font-bold text-white tracking-wide">
                  {task.title}
                </h3>
              </div>

              <Link
                href={task.href}
                className="w-full bg-[#52bce3] hover:bg-[#3ba8ce] text-[#111827] font-semibold text-center py-3 px-6 rounded-lg transition-colors mt-8"
              >
                {task.buttonText}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
