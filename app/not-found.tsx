import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="not-found-page">
        <span className="eyebrow">Page not found</span>
        <h1>That page has<br />moved out of view.</h1>
        <p>The address may be incorrect, or the page may not have been published yet.</p>
        <Link href="/" className="button button-primary"><Home size={16} /> Back to homepage</Link>
        <Link href="/#contact" className="not-found-back"><ArrowLeft size={14} /> Contact Wazir Trading</Link>
      </main>
      <SiteFooter />
    </>
  );
}
