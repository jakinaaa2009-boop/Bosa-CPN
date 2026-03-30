import { redirect } from "next/navigation";

/** Backwards compatibility: old bookmarks → `/admin` */
export default function AdminLoginRedirectPage() {
  redirect("/admin");
}
