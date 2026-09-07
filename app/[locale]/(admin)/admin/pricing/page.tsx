import { countriesApi, fieldsApi, majorsApi } from "@/lib/api/catalog";
import { getHourlyPrices, getSubscriptionPlans } from "@/lib/api/subscriptions";
import { CatalogManager } from "../_components/CatalogManager";

export default async function AdminPricingPage() {
  const [countries, fields, majors, prices, plans] = await Promise.all([
    countriesApi.list(), fieldsApi.list(), majorsApi.list(), getHourlyPrices(), getSubscriptionPlans(),
  ]);
  return <CatalogManager countries={countries} fields={fields} majors={majors} prices={prices} plans={plans} />;
}
