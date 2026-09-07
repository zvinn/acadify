"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api/client";
import { countriesApi, fieldsApi, majorsApi } from "@/lib/api/catalog";
import {
  cancelSubscription as cancelSubscriptionRequest,
  createHourlyPrice,
  createSubscriptionPlan,
  deleteHourlyPrice,
  deleteSubscriptionPlan,
  updateHourlyPrice,
  updateSubscriptionPlan,
} from "@/lib/api/subscriptions";
import {
  createInstructor,
  createStudent,
  deleteInstructor,
  deleteStudent,
  updateInstructor,
  updateStudent,
} from "@/lib/api/users";
import {
  approveWithdrawal,
  lockWallet,
  manualChargeWallet,
  rejectWithdrawal,
  unlockWallet,
  uploadWithdrawalReceipt,
} from "@/lib/api/wallets";
import { changeRequestStatus, deleteRequest } from "@/lib/api/requests";
import {
  deleteNotification,
  sendNotificationToAllInstructors,
  sendNotificationToAllStudents,
} from "@/lib/api/notifications";

export type AdminActionState = { ok?: boolean; message?: string };

const text = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
};

function number(data: FormData, key: string) {
  const value = Number(text(data, key));
  return Number.isFinite(value) ? value : undefined;
}

function errorState(error: unknown): AdminActionState {
  if (error instanceof ApiError || error instanceof Error) {
    return { message: error.message };
  }
  return { message: "The operation failed. Please try again." };
}

function refreshAdmin() {
  revalidatePath("/[locale]/admin", "layout");
}

function userBody(data: FormData) {
  const body: Record<string, unknown> = {};
  for (const key of [
    "fullName",
    "email",
    "phoneNumber",
    "status",
    "university",
    "faculty",
    "specialization",
    "currentJob",
    "major",
    "country",
    "year",
    "password",
  ]) {
    const value = text(data, key);
    if (value) body[key] = value;
  }
  const age = number(data, "age");
  if (age != null) body.age = age;
  return body;
}

export async function saveAdminUser(
  _state: AdminActionState,
  data: FormData,
): Promise<AdminActionState> {
  const kind = text(data, "kind") === "instructor" ? "instructor" : "student";
  const id = text(data, "id");
  try {
    if (id) {
      await (kind === "instructor"
        ? updateInstructor(id, userBody(data))
        : updateStudent(id, userBody(data)));
    } else {
      await (kind === "instructor"
        ? createInstructor(userBody(data))
        : createStudent(userBody(data)));
    }
    refreshAdmin();
    return { ok: true, message: `${kind} saved successfully.` };
  } catch (error) {
    return errorState(error);
  }
}

export async function removeAdminUser(data: FormData) {
  const kind = text(data, "kind") === "instructor" ? "instructor" : "student";
  const id = text(data, "id");
  if (!id) return;
  if (kind === "instructor") await deleteInstructor(id);
  else await deleteStudent(id);
  refreshAdmin();
}

function genericBody(data: FormData) {
  const body: Record<string, unknown> = {};
  for (const [key, rawValue] of data.entries()) {
    if (["resource", "operation", "id"].includes(key) || typeof rawValue !== "string") continue;
    const value = rawValue.trim();
    if (!value) continue;
    body[key] = /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : value;
  }
  return body;
}

export async function saveCatalogResource(
  _state: AdminActionState,
  data: FormData,
): Promise<AdminActionState> {
  const resource = text(data, "resource");
  const operation = text(data, "operation") || "save";
  const id = text(data, "id");
  const body = genericBody(data);
  try {
    if (resource === "country") {
      if (operation === "delete") await countriesApi.remove(id);
      else if (id) await countriesApi.update(id, body);
      else await countriesApi.create(body);
    } else if (resource === "field") {
      if (operation === "delete") await fieldsApi.remove(id);
      else if (id) await fieldsApi.update(id, body);
      else await fieldsApi.create(body);
    } else if (resource === "major") {
      if (operation === "delete") await majorsApi.remove(id);
      else if (id) await majorsApi.update(id, body);
      else await majorsApi.create(body);
    } else if (resource === "hourlyPrice") {
      if (operation === "delete") await deleteHourlyPrice(id);
      else if (id) await updateHourlyPrice(id, body);
      else await createHourlyPrice(body);
    } else if (resource === "plan") {
      if (operation === "delete") await deleteSubscriptionPlan(id);
      else if (id) await updateSubscriptionPlan(id, body);
      else await createSubscriptionPlan(body);
    } else {
      return { message: "Unsupported catalog resource." };
    }
    refreshAdmin();
    return { ok: true, message: "Saved successfully." };
  } catch (error) {
    return errorState(error);
  }
}

export async function removeCatalogResource(data: FormData) {
  await saveCatalogResource({}, data);
}

export async function manageWallet(
  _state: AdminActionState,
  data: FormData,
): Promise<AdminActionState> {
  const operation = text(data, "operation");
  const email = text(data, "email");
  const transactionId = text(data, "transactionId");
  try {
    if (operation === "lock") await lockWallet(email);
    else if (operation === "unlock") await unlockWallet(email);
    else if (operation === "charge") await manualChargeWallet(email, number(data, "balanceUSD") ?? 0);
    else if (operation === "approve") await approveWithdrawal(transactionId);
    else if (operation === "reject") await rejectWithdrawal(transactionId);
    else if (operation === "receipt") {
      const receipt = data.get("receipt");
      if (!(receipt instanceof File) || !receipt.size) return { message: "Receipt file is required." };
      await uploadWithdrawalReceipt(transactionId, receipt);
    } else return { message: "Unsupported wallet operation." };
    refreshAdmin();
    return { ok: true, message: "Wallet operation completed." };
  } catch (error) {
    return errorState(error);
  }
}

export async function manageRequest(
  _state: AdminActionState,
  data: FormData,
): Promise<AdminActionState> {
  const id = text(data, "id");
  try {
    if (text(data, "operation") === "delete") await deleteRequest(id);
    else await changeRequestStatus(id, text(data, "status"));
    refreshAdmin();
    return { ok: true, message: "Request updated." };
  } catch (error) {
    return errorState(error);
  }
}

export async function manageNotification(
  _state: AdminActionState,
  data: FormData,
): Promise<AdminActionState> {
  const operation = text(data, "operation");
  try {
    if (operation === "delete") await deleteNotification(text(data, "id"));
    else {
      const body = {
        title: text(data, "title"),
        body: text(data, "body"),
        type: text(data, "type") || "system",
      };
      if (operation === "send-instructors") await sendNotificationToAllInstructors(body);
      else await sendNotificationToAllStudents(body);
    }
    refreshAdmin();
    return { ok: true, message: "Notification operation completed." };
  } catch (error) {
    return errorState(error);
  }
}

export async function manageAdminSubscription(
  _state: AdminActionState,
  data: FormData,
): Promise<AdminActionState> {
  const id = text(data, "id");
  if (!id) return { message: "Subscription ID is required." };

  try {
    await cancelSubscriptionRequest(id);
    refreshAdmin();
    return { ok: true, message: "Subscription cancelled successfully." };
  } catch (error) {
    return errorState(error);
  }
}
