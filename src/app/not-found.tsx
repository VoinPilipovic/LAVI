import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <div className="divider-gold max-w-xs" />
      <div className="space-y-2">
        <span className="text-eyebrow">404</span>
        <h1 className="font-display text-2xl text-ivory">Page not found</h1>
        <p className="max-w-md text-sm text-ivory-dim">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
      </div>
      <Button asChild>
        <a href="/">Back to homepage</a>
      </Button>
    </div>
  );
}
