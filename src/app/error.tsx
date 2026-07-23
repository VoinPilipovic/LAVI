"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <div className="divider-gold max-w-xs" />
      <div className="space-y-2">
        <h1 className="font-display text-2xl text-ivory">Something went wrong</h1>
        <p className="max-w-md text-sm text-ivory-dim">
          The page couldn&apos;t load. Try again, or head back to the homepage.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
        <Button asChild>
          <a href="/">Go home</a>
        </Button>
      </div>
    </div>
  );
}
