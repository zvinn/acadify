export const dynamic = "force-dynamic";

import { FileText, Clock, MessageSquare } from "lucide-react";
import ActionSuccess from "@/components/shared/ActionSuccess";

export default function AssignmentSuccessPage() {
  const infoCards = [
    {
      icon: FileText,
      title: "Project Files",
      description: "All reference documents have been indexed and are ready.",
    },
    {
      icon: Clock,
      title: "Deadline Tracking",
      description: "Automated reminders set for your upcoming milestones.",
    },
    {
      icon: MessageSquare,
      title: "Collaboration",
      description: "Direct channel opened for project-specific queries.",
    },
  ];

  return (
    <ActionSuccess
      title="Assignment Confirmed Successfully"
      description="The assignment has been added to my project. ,you can now start working on the files and manage everything from My Projects."
      buttonText="Go to my project"
      buttonHref="/projects"
    >
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-6">
        {infoCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-start"
            >
              <div className="w-12 h-12 bg-[#eff6ff] rounded-xl flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-[#0369a1]" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-3">
                {card.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </ActionSuccess>
  );
}
