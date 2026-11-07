"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { siteConfig, whatsappUrl } from "@/lib/site";

const navigation = [
  { label: "Vehicles", href: "/cars" },
  { label: "Makes", href: "/makes" },
  { label: "Destinations", href: "/import-japanese-cars" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Shipping", href: "/shipping-information" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const waLink = whatsappUrl(
    "Hello, I would like information about purchasing a Japanese used vehicle from Wazir Trading LLC.",
  );

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <div className="utility-bar">
        <div className="site-container utility-inner">
          <p>Japan-based vehicle sourcing & export information</p>
          <div className="utility-links">
            <span>Kuwana, Mie, Japan</span>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="site-container header-inner">
          <Link href="/" className="brand" aria-label="Wazir Trading LLC home" onClick={closeMenu}>
            <Image src="/favicon.svg" alt="" width={42} height={42} priority />
            <span className="brand-wordmark">
              <strong>WAZIR</strong>
              <span>TRADING LLC</span>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <a className="button button-primary button-small" href={waLink} target="_blank" rel="noreferrer">
              Request a quote <ArrowUpRight size={15} strokeWidth={2.2} />
            </a>
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="mobile-nav-link" onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
            <a className="button button-primary mobile-nav-cta" href={waLink} target="_blank" rel="noreferrer">
              Request a quote <ArrowUpRight size={16} />
            </a>
          </nav>
        ) : null}
      </header>
    </>
  );
}
