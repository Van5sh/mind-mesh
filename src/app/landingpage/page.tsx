import { redirect } from "next/navigation";

export default function LegacyLandingPageRedirect() {
  redirect("/dashboard");
}
