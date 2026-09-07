"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import type { ApiCountry, ApiField, ApiMajor } from "@/lib/api/catalog";
import type { ApiHourlyPrice, ApiSubscriptionPlan } from "@/lib/api/subscriptions";
import { idOf, recordOf, textOf } from "@/lib/api/response";
import { removeCatalogResource, saveCatalogResource, type AdminActionState } from "../actions";

type Resource = "country" | "field" | "major" | "hourlyPrice" | "plan";
type Item = ApiCountry | ApiField | ApiMajor | ApiHourlyPrice | ApiSubscriptionPlan;
const initialState: AdminActionState = {};

const config: Record<Resource, { label: string; fields: { name: string; label: string; type?: string }[] }> = {
  country: { label: "Countries", fields: [
    { name: "name", label: "Name" }, { name: "code", label: "Code" }, { name: "phoneCode", label: "Phone code" },
    { name: "currencyCode", label: "Currency code" }, { name: "currencyName", label: "Currency name" }, { name: "currencySymbol", label: "Currency symbol" },
  ] },
  field: { label: "Fields", fields: [{ name: "name", label: "Name" }, { name: "description", label: "Description" }] },
  major: { label: "Majors", fields: [{ name: "name", label: "Name" }, { name: "field", label: "Field ID" }] },
  hourlyPrice: { label: "Hourly prices", fields: [
    { name: "countryId", label: "Country ID" }, { name: "studentHourlyRateUSD", label: "Student rate USD", type: "number" },
    { name: "instructorHourlyRateUSD", label: "Instructor rate USD", type: "number" },
  ] },
  plan: { label: "Subscription plans", fields: [
    { name: "name", label: "Name" }, { name: "price", label: "Price", type: "number" },
    { name: "numberOfHours", label: "Hours", type: "number" }, { name: "duration", label: "Duration", type: "number" },
  ] },
};

export function CatalogManager({ countries, fields, majors, prices, plans }: {
  countries: ApiCountry[]; fields: ApiField[]; majors: ApiMajor[]; prices: ApiHourlyPrice[]; plans: ApiSubscriptionPlan[];
}) {
  const [resource, setResource] = useState<Resource>("country");
  const [showForm, setShowForm] = useState(false);
  const [state, action, pending] = useActionState(saveCatalogResource, initialState);
  const data: Record<Resource, Item[]> = { country: countries, field: fields, major: majors, hourlyPrice: prices, plan: plans };
  const current = config[resource];

  return (
    <div className="p-6 lg:p-9">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#5CC0D6]">Backend catalog</p><h1 className="mt-2 text-3xl font-black text-[#162535]">Catalog & Pricing</h1><p className="mt-2 text-sm text-slate-500">Manage lookup data and subscription pricing.</p></div>
        <button type="button" onClick={() => setShowForm((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#162535] px-6 py-3 text-sm font-black text-white"><Plus size={17} /> Add record</button>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {(Object.keys(config) as Resource[]).map((key) => <button key={key} type="button" onClick={() => { setResource(key); setShowForm(false); }} className={`rounded-full px-4 py-2 text-xs font-black ${resource === key ? "bg-[#5CC0D6] text-white" : "bg-white text-slate-500 ring-1 ring-slate-100"}`}>{config[key].label}</button>)}
      </div>

      {showForm && (
        <form action={action} className="mt-6 grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:grid-cols-2">
          <input type="hidden" name="resource" value={resource} />
          {current.fields.map((field) => <label key={field.name}><span className="mb-2 block text-xs font-black text-slate-500">{field.label}</span><input name={field.name} type={field.type ?? "text"} required className="h-12 w-full rounded-xl bg-slate-50 px-4 text-sm font-semibold outline-none ring-1 ring-slate-100 focus:ring-[#5CC0D6]" /></label>)}
          {state.message && <p className={`md:col-span-2 rounded-xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{state.message}</p>}
          <div className="md:col-span-2 flex justify-end"><button disabled={pending} className="rounded-full bg-[#5CC0D6] px-7 py-3 text-sm font-black text-white disabled:opacity-50">{pending ? "Saving..." : "Save record"}</button></div>
        </form>
      )}

      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
        {data[resource].map((item, index) => {
          const record = recordOf(item);
          const id = idOf(item);
          const name = textOf(record.name, textOf(record.code, `${current.label} record`));
          const detail = Object.entries(record).filter(([key, value]) => !["_id", "id", "name", "createdAt", "updatedAt"].includes(key) && ["string", "number", "boolean"].includes(typeof value)).slice(0, 3).map(([key, value]) => `${key}: ${String(value)}`).join(" · ");
          return <article key={id || index} className="flex flex-col justify-between gap-4 border-b border-slate-100 px-6 py-5 last:border-0 sm:flex-row sm:items-center"><div className="min-w-0"><p className="truncate text-sm font-black text-[#162535]">{name}</p><p className="mt-1 truncate text-xs text-slate-400">{detail || id}</p></div>{id && <form action={removeCatalogResource} onSubmit={(event) => { if (!window.confirm("Delete this record?")) event.preventDefault(); }}><input type="hidden" name="resource" value={resource} /><input type="hidden" name="operation" value="delete" /><input type="hidden" name="id" value={id} /><button aria-label="Delete record" className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500"><Trash2 size={16} /></button></form>}</article>;
        })}
        {data[resource].length === 0 && <p className="px-6 py-14 text-center text-sm text-slate-500">No records returned by the backend.</p>}
      </div>
    </div>
  );
}
