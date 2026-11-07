import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { breadcrumbJsonLd, safeJsonLd } from "@/lib/structured-data";

export function LandingPageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="seo-landing-page">{children}</main>
      <SiteFooter />
    </>
  );
}

export function LandingBreadcrumbs({ items }: { items: Array<{ label: string; href?: string; path?: string }> }) {
  const schemaItems = [{ name: "Home", path: "/" }, ...items.map((item) => ({ name: item.label, path: item.path ?? item.href ?? "" }))];
  return (
    <>
      <nav className="seo-breadcrumbs site-container" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        {items.map((item, index) => (
          <span key={`${item.label}-${index}`} className="seo-breadcrumb-item">
            <span aria-hidden="true">/</span>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </span>
        ))}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd(schemaItems)) }} />
    </>
  );
}

export function LandingHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  actions?: Array<{ label: string; href: string; external?: boolean }>;
  aside?: ReactNode;
}) {
  return (
    <section className="seo-landing-hero">
      <div className="site-container seo-landing-hero-grid">
        <div className="seo-landing-hero-copy">
          <span className="seo-landing-eyebrow"><span />{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          {actions?.length ? (
            <div className="seo-landing-actions">
              {actions.map((action, index) => action.external ? (
                <a key={action.href} className={index === 0 ? "button button-primary" : "button button-outline-light"} href={action.href} target="_blank" rel="noreferrer">
                  {action.label}<ArrowUpRight size={16} />
                </a>
              ) : (
                <Link key={action.href} className={index === 0 ? "button button-primary" : "button button-outline-light"} href={action.href}>
                  {action.label}<ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        {aside ? <div className="seo-landing-hero-aside">{aside}</div> : <div className="seo-landing-hero-index" aria-hidden="true"><span>WT / EXPORT</span><strong>JAPAN</strong><small>VEHICLE SOURCING & EXPORT INFORMATION</small></div>}
      </div>
    </section>
  );
}

export function LandingSectionHeading({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description?: string }) {
  return (
    <div className="seo-section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function LandingCta({
  title = "Have a vehicle or destination in mind?",
  description = "Share the vehicle you are considering and your destination. We can confirm which details and export arrangements need to be checked.",
  message,
}: {
  title?: string;
  description?: string;
  message: string;
}) {
  const href = whatsappUrl(message);
  return (
    <section className="seo-landing-cta">
      <div className="site-container seo-landing-cta-inner">
        <div>
          <span className="seo-landing-eyebrow seo-landing-eyebrow-light"><span /> WAZIR TRADING LLC · JAPAN</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="seo-landing-cta-actions">
          <a className="button button-primary" href={href} target="_blank" rel="noreferrer">Discuss your requirements <MessageCircle size={16} /></a>
          <Link className="button button-outline-light" href="/cars">Browse available vehicles <ArrowRight size={16} /></Link>
          <small>Availability, export eligibility, freight and destination import requirements are confirmed individually.</small>
        </div>
      </div>
    </section>
  );
}

export function LandingFeatureList({ items }: { items: string[] }) {
  return (
    <ul className="seo-feature-list">
      {items.map((item) => <li key={item}><CheckCircle2 size={17} /> <span>{item}</span></li>)}
    </ul>
  );
}

export function LandingSchema({ value }: { value: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(value) }} />;
}

export function LandingLinkCard({
  href,
  title,
  description,
  meta,
}: {
  href: string;
  title: string;
  description: string;
  meta?: string;
}) {
  return (
    <Link href={href} className="seo-link-card">
      <span className="seo-link-card-top">{meta ?? "EXPLORE"}<ArrowUpRight size={17} /></span>
      <strong>{title}</strong>
      <span className="seo-link-card-description">{description}</span>
      <span className="seo-link-card-action">Explore page <ArrowRight size={14} /></span>
    </Link>
  );
}

export function LandingPageTop({ items }: { items: Array<{ label: string; href?: string }> }) {
  return <LandingBreadcrumbs items={items} />;
}

export function SeoIndexNote() {
  return <p className="seo-index-note">Vehicle information reflects the current public inventory records available to this page. Availability and export suitability must be reconfirmed before purchase.</p>;
}

export function landingCollectionUrl(path: string) {
  return `${siteConfig.url}${path}`;
}
