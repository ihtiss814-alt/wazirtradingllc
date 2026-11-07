import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";

type HeroAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  external?: boolean;
};

export function TrustPageHero({
  eyebrow,
  title,
  description,
  actions = [],
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  actions?: HeroAction[];
  aside?: ReactNode;
}) {
  return (
    <section className="trust-hero">
      <div className="trust-hero-grid site-container">
        <div className="trust-hero-copy">
          <span className="trust-eyebrow"><span />{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          {actions.length > 0 ? (
            <div className="trust-hero-actions">
              {actions.map((action) => {
                const className = action.variant === "secondary" ? "button button-ghost-light" : "button button-primary";
                return action.external ? (
                  <a key={action.href} className={className} href={action.href} target="_blank" rel="noreferrer">
                    {action.label}<ArrowUpRight size={16} />
                  </a>
                ) : (
                  <Link key={action.href} className={className} href={action.href}>
                    {action.label}<ArrowUpRight size={16} />
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
        {aside ? <div className="trust-hero-aside">{aside}</div> : null}
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="trust-breadcrumbs site-container" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item, index) => (
        <span className="trust-breadcrumb-item" key={`${item.label}-${index}`}>
          <ChevronRight size={13} aria-hidden="true" />
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`trust-section-heading${align === "center" ? " is-centered" : ""}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function FeatureCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="trust-feature-card">
      <div className="trust-feature-icon" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      <div className="trust-feature-copy">{children}</div>
    </article>
  );
}

export function StepCard({
  number,
  icon,
  title,
  children,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="trust-step-card">
      <div className="trust-step-top">
        <span>{number}</span>
        <div className="trust-feature-icon" aria-hidden="true">{icon}</div>
      </div>
      <h3>{title}</h3>
      <div className="trust-feature-copy">{children}</div>
    </article>
  );
}

export function TrustCta({
  eyebrow = "Talk with the Japan team",
  title,
  description,
  href = "/contact",
  label = "Contact Wazir Trading",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="trust-cta-section">
      <div className="site-container trust-cta-inner">
        <div>
          <span>{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <Link href={href} className="button button-primary">{label}<ArrowRight size={17} /></Link>
      </div>
    </section>
  );
}

export function Notice({ title, children, tone = "neutral" }: { title: string; children: ReactNode; tone?: "neutral" | "warning" }) {
  return (
    <aside className={`trust-notice${tone === "warning" ? " is-warning" : ""}`}>
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}
