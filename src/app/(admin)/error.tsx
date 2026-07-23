"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h1 className="font-display text-xl text-ivory">Something went wrong</h1>
        <p className="max-w-md text-sm text-ivory-dim">
          This part of the dashboard couldn&apos;t load. Try again, or use the sidebar to go
          elsewhere.
        </p>
      </div>
      <Button variant="outline" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
