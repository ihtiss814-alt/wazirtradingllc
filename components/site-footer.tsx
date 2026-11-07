import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, whatsappUrl } from "@/lib/site";

export function SiteFooter() {
  const waLink = whatsappUrl("Hello, I have a question about buying a vehicle from Japan.");

  return (
    <footer className="site-footer" id="contact">
      <div className="site-container footer-main">
        <div className="footer-brand-column">
          <Link href="/" className="footer-logo" aria-label="Wazir Trading LLC home">
            <Image src="/brand-lockup.webp" alt="Wazir Trading LLC" width={180} height={136} />
          </Link>
          <p className="footer-description">
            Japanese used vehicle sourcing and export information, with a Japan-based operation and a direct line for buyer enquiries.
          </p>
          <div className="footer-socials">
            <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={17} />
            </a>
            <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <span className="facebook-letter">f</span>
            </a>
            <a href={waLink} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <Phone size={16} />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h2>Explore</h2>
          <Link href="/cars">Available vehicles</Link>
          <Link href="/makes">Browse by make</Link>
          <Link href="/vehicle-types">Browse by vehicle type</Link>
          <Link href="/import-japanese-cars">Destination information</Link>
          <Link href="/about">About Wazir Trading</Link>
          <Link href="/contact">Contact the team</Link>
        </div>

        <div className="footer-column">
          <h2>Buying support</h2>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/shipping-information">Shipping information</Link>
          <Link href="/payment-information">Payment information</Link>
        </div>

        <div className="footer-column">
          <h2>Get in touch</h2>
          <a href={`mailto:${siteConfig.email}`}><Mail size={15} /> {siteConfig.email}</a>
          <a href={waLink} target="_blank" rel="noreferrer"><Phone size={15} /> WhatsApp enquiry</a>
          <p><MapPin size={15} /> Kuwana, Mie, Japan</p>
          <a className="footer-address-link" href="https://maps.google.com/?q=Heights+Mizutani+1C+158-1+Jizou+Kuwana+Mie+Japan" target="_blank" rel="noreferrer">
            View Japan office area <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      <div className="site-container footer-bottom">
        <p>© {new Date().getFullYear()} Wazir Trading LLC. All rights reserved.</p>
        <p>Vehicle availability, export eligibility, freight and import requirements are confirmed individually.</p>
      </div>
    </footer>
  );
}
