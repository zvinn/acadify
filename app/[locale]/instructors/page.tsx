import { getTranslations, setRequestLocale } from "next-intl/server";
import MarketingInfoPage from "@/app/components/MarketingInfoPage";

export default async function InstructorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("marketingPages.instructors");
  return <MarketingInfoPage badge={t("badge")} title={t("title")} description={t("description")} sectionTitle={t("sectionTitle")} steps={[1, 2, 3].map((n) => ({ title: t(`step${n}Title`), description: t(`step${n}Description`) }))} ctaTitle={t("ctaTitle")} ctaDescription={t("ctaDescription")} primaryLabel={t("primary")} primaryHref="/auth/instructor/register" secondaryLabel={t("secondary")} secondaryHref="/contact" variant="instructors" />;
}
