import "server-only";

import { apiRequest } from "@/lib/api/client";
import { arrayOf, objectOf } from "@/lib/api/response";

export type ApiCountry = {
  _id?: string;
  id?: string;
  name?: string;
  code?: string;
  phoneCode?: string;
  currencyCode?: string;
  currencyName?: string;
  currencySymbol?: string;
};

export type ApiField = {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
};

export type ApiMajor = {
  _id?: string;
  id?: string;
  name?: string;
  field?: string | ApiField;
};

type Input = Record<string, unknown>;

function crud<T>(resource: string, keys: string[]) {
  return {
    list: async () => {
      const payload = await apiRequest<unknown>(`/api/v1/${resource}`);
      return arrayOf<T>(payload, keys);
    },
    get: async (id: string) => {
      const payload = await apiRequest<unknown>(`/api/v1/${resource}/${id}`);
      return objectOf<T>(payload, keys.map((key) => key.replace(/s$/, "")));
    },
    create: (body: Input) =>
      apiRequest<unknown>(`/api/v1/${resource}`, { method: "POST", body }),
    update: (id: string, body: Input) =>
      apiRequest<unknown>(`/api/v1/${resource}/${id}`, {
        method: "PATCH",
        body,
      }),
    remove: (id: string) =>
      apiRequest<unknown>(`/api/v1/${resource}/${id}`, { method: "DELETE" }),
  };
}

export const countriesApi = crud<ApiCountry>("countries", ["countries"]);
export const fieldsApi = crud<ApiField>("fields", ["fields"]);
export const majorsApi = crud<ApiMajor>("majors", ["majors"]);

export async function getMajorsForField(fieldId: string) {
  const payload = await apiRequest<unknown>(`/api/v1/fields/${fieldId}/majors`);
  return arrayOf<ApiMajor>(payload, ["majors"]);
}

export function createMajorForField(fieldId: string, body: Input) {
  return apiRequest<unknown>(`/api/v1/fields/${fieldId}/majors`, {
    method: "POST",
    body,
  });
}
