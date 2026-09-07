import { getTranslations, setRequestLocale } from "next-intl/server";
import MarketingInfoPage from "@/app/components/MarketingInfoPage";

export default async function StudentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("marketingPages.students");
  return <MarketingInfoPage badge={t("badge")} title={t("title")} description={t("description")} sectionTitle={t("sectionTitle")} steps={[1, 2, 3].map((n) => ({ title: t(`step${n}Title`), description: t(`step${n}Description`) }))} ctaTitle={t("ctaTitle")} ctaDescription={t("ctaDescription")} primaryLabel={t("primary")} primaryHref="/get-started" secondaryLabel={t("secondary")} secondaryHref="/how-it-works" variant="students" />;
}
