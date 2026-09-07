import { notFound } from "next/navigation";

import { getMyOffers } from "@/lib/api/offers";
import { idOf } from "@/lib/api/response";
import { OfferDetail } from "../../_components/OfferDetail";

export default async function TrialOfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = (await getMyOffers()).find((item) => idOf(item) === id);
  if (!offer) notFound();
  return <OfferDetail offer={offer} backHref="/instructor/offers/trial" label="Trial offer" />;
}
