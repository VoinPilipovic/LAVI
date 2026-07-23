import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-ink px-6 py-16">
      <Logo />
      {children}
    </div>
  );
}
