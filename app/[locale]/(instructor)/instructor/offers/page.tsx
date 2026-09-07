import { Link } from "@/src/i18n/navigation";
import { ArrowLeft, ClipboardCheck, GraduationCap } from "lucide-react";

const OFFER_TYPES = [
  {
    id: "trial",
    title: "Trial",
    buttonLabel: "Explain",
    href: "/instructor/offers/trial",
    icon: ClipboardCheck,
  },
  {
    id: "explain",
    title: "Explain",
    buttonLabel: "Explain",
    href: "/instructor/offers/explain",
    icon: GraduationCap,
  },
];

export default function InstructorOffersPage() {
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
            Offers
          </h1>
          <p className="mt-5 text-base font-medium text-slate-700 sm:text-lg">
            Choose the type of offers you want to work on.
          </p>
        </header>

        <section className="mx-auto mt-24 grid max-w-4xl gap-24 md:grid-cols-2" aria-label="Offer types">
          {OFFER_TYPES.map((offer) => {
            const Icon = offer.icon;

            return (
              <article
                key={offer.id}
                className="flex min-h-[320px] flex-col items-center rounded-lg bg-[#142235] px-10 py-12 text-center text-white shadow-sm"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#bceeff] text-[#126f92]">
                  <Icon className="h-9 w-9" />
                </div>

                <h2 className="mt-10 text-2xl font-black">{offer.title}</h2>

                <Link
                  href={offer.href}
                  className="mt-auto inline-flex h-14 w-full max-w-[240px] items-center justify-center rounded-lg bg-[#52bce3] text-sm font-black text-[#142235] transition-colors hover:bg-[#3ba8ce]"
                >
                  {offer.buttonLabel}
                </Link>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
