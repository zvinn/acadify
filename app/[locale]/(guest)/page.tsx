import { setRequestLocale } from "next-intl/server";

import CTASection from "../../components/CTASection";
import Hero from "../../components/Hero";
import ProcessSteps from "../../components/ProcessSteps";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-white selection:bg-brand-primary selection:text-white">
      <Hero />
      <ProcessSteps />
      <CTASection />
    </div>
  );
}
