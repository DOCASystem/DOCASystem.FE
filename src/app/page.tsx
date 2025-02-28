import { redirect } from "next/navigation";

export default function Page() {
  // redirect("/about-us");
  // redirect("/home");
  redirect("/auth/login");
}
