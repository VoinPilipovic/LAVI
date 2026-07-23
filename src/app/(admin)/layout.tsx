import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar, AdminMobileNav } from "@/components/dashboard/admin/sidebar";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Admin", noIndex: true });

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin-login");
  }

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminProfile) {
    redirect("/admin-login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink md:flex-row">
      <AdminMobileNav />
      <AdminSidebar adminName={adminProfile.full_name} />
      <main id="main-content" className="flex-1 px-5 py-8 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
