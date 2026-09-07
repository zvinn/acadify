import { Link } from "@/src/i18n/navigation";
import { ArrowLeft, FileText, GraduationCap } from "lucide-react";

const PROJECT_TYPES = [
  {
    id: "assignment",
    title: "Assignment",
    description:
      "Work on student assignments and submit your offer. Review requirements, deadlines, and project scopes.",
    buttonLabel: "Assignments",
    href: "/instructor/projects/assignment",
    icon: FileText,
  },
  {
    id: "explain",
    title: "Explain",
    description:
      "Provide explanation sessions for students based on their needs. Host live tutoring or deep-dive concept reviews.",
    buttonLabel: "Explain",
    href: "/instructor/projects/explain",
    icon: GraduationCap,
  },
];

export default function InstructorProjectsPage() {
  return (
    <div className="min-h-[calc(100vh-96px)] bg-white px-4 py-7 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/instructor/tasks"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <header className="pt-28 text-center">
          <h1 className="text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">
            My projects
          </h1>
          <p className="mt-5 text-base font-medium text-slate-700 sm:text-lg">
            Choose the type of project you want to work on.
          </p>
        </header>

        <section className="mx-auto mt-24 grid max-w-5xl gap-10 md:grid-cols-2" aria-label="Project types">
          {PROJECT_TYPES.map((project) => {
            const Icon = project.icon;

            return (
              <article
                key={project.id}
                className="flex min-h-[340px] flex-col items-center rounded-lg bg-[#142235] px-10 py-10 text-center text-white shadow-sm"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#bceeff] text-[#126f92]">
                  <Icon className="h-9 w-9" />
                </div>

                <h2 className="mt-9 text-2xl font-black">{project.title}</h2>
                <p className="mt-5 max-w-sm text-sm font-medium leading-6 text-slate-100">
                  {project.description}
                </p>

                <Link
                  href={project.href}
                  className="mt-auto inline-flex h-14 w-full max-w-[220px] items-center justify-center rounded-lg bg-[#52bce3] text-sm font-black text-[#142235] transition-colors hover:bg-[#3ba8ce]"
                >
                  {project.buttonLabel}
                </Link>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
