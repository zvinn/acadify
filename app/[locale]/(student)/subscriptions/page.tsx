import { getStudentMe } from "@/lib/api/profile";
import { idOf, recordOf, textOf } from "@/lib/api/response";
import { getSubscriptionPlans, getSubscriptions } from "@/lib/api/subscriptions";
import { SubscriptionsClient } from "./SubscriptionsClient";

export default async function StudentSubscriptionsPage() {
  const [plansResult, subscriptionsResult, userResult] = await Promise.allSettled([
    getSubscriptionPlans(),
    getSubscriptions(),
    getStudentMe(),
  ]);
  const plans = plansResult.status === "fulfilled" ? plansResult.value : [];
  const allSubscriptions = subscriptionsResult.status === "fulfilled" ? subscriptionsResult.value : [];
  const user = userResult.status === "fulfilled" ? userResult.value : {};
  const userId = idOf(user);
  const userEmail = textOf(recordOf(user).email).toLowerCase();
  const subscriptions = allSubscriptions.filter((subscription) => {
    const student = recordOf(subscription.studentId);
    const studentId = idOf(subscription.studentId);
    const studentEmail = textOf(student.email).toLowerCase();
    if (!studentId && !studentEmail) return true;
    return Boolean((userId && studentId === userId) || (userEmail && studentEmail === userEmail));
  });
  const majorId = idOf(recordOf(user).major);
  const unavailable = [plansResult, subscriptionsResult].some((result) => result.status === "rejected");

  return <SubscriptionsClient plans={plans} subscriptions={subscriptions} majorId={majorId} availabilityMessage={unavailable ? "The backend denied one or more subscription read endpoints for this student account. Available data is shown without mock records." : undefined} />;
}
