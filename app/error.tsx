"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="not-found-page">
      <span className="eyebrow">Unexpected error</span>
      <h1>We could not load<br />this page.</h1>
      <p>Please try again. If the problem continues, return to the homepage and contact our team.</p>
      <button className="button button-primary" onClick={() => reset()} type="button"><RefreshCw size={16} /> Try again</button>
      <Link href="/" className="not-found-back">Return to homepage</Link>
    </main>
  );
}
