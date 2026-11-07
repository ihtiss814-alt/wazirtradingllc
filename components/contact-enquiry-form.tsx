"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

const enquiryTypes = [
  "Vehicle in current inventory",
  "Vehicle sourcing request",
  "Shipping quotation",
  "Payment or invoice question",
  "General enquiry",
];

export function ContactEnquiryForm() {
  const [enquiryType, setEnquiryType] = useState(enquiryTypes[0]);
  const [preparedLink, setPreparedLink] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = [
      "Hello Wazir Trading LLC, I would like to make an enquiry.",
      `Enquiry type: ${enquiryType}`,
      `Name: ${String(data.get("name") ?? "").trim()}`,
      `Email: ${String(data.get("email") ?? "").trim()}`,
      `WhatsApp / phone: ${String(data.get("phone") ?? "").trim() || "Not provided"}`,
      `Destination country: ${String(data.get("country") ?? "").trim()}`,
      `Vehicle reference (if applicable): ${String(data.get("reference") ?? "").trim() || "Not provided"}`,
      `Message: ${String(data.get("message") ?? "").trim()}`,
    ].join("\n");
    const href = whatsappUrl(message);
    setPreparedLink(href);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="contact-form-card">
      <div className="contact-form-heading">
        <span className="eyebrow">Send an enquiry</span>
        <h2>Tell us what you need.</h2>
        <p>Complete the fields and continue in WhatsApp. Your message opens as a draft for you to review and send.</p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label className="trust-form-field">
          <span>What can we help with? <b aria-hidden="true">*</b></span>
          <select value={enquiryType} onChange={(event: ChangeEvent<HTMLSelectElement>) => setEnquiryType(event.target.value)}>
            {enquiryTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <div className="contact-form-grid">
          <label className="trust-form-field">
            <span>Full name <b aria-hidden="true">*</b></span>
            <input required name="name" autoComplete="name" maxLength={100} placeholder="Your name" />
          </label>
          <label className="trust-form-field">
            <span>Email address <b aria-hidden="true">*</b></span>
            <input required name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" />
          </label>
          <label className="trust-form-field">
            <span>WhatsApp / phone</span>
            <input name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="Include country code" />
          </label>
          <label className="trust-form-field">
            <span>Destination country <b aria-hidden="true">*</b></span>
            <input required name="country" autoComplete="country-name" maxLength={80} placeholder="Where will the vehicle go?" />
          </label>
          <label className="trust-form-field contact-form-full">
            <span>Vehicle reference (optional)</span>
            <input name="reference" maxLength={80} placeholder="Enter the reference shown on the listing" />
          </label>
          <label className="trust-form-field contact-form-full">
            <span>Your message <b aria-hidden="true">*</b></span>
            <textarea required name="message" minLength={10} maxLength={1200} rows={5} placeholder="Tell us about the vehicle, destination, timing or question you have." />
          </label>
        </div>
        <button className="button button-primary contact-submit" type="submit">
          <MessageCircle size={17} /> Continue in WhatsApp <ArrowUpRight size={16} />
        </button>
        <p className="contact-form-disclaimer">This form does not send or store your information on this website. It prepares a WhatsApp message; you choose whether to send it.</p>
        {preparedLink ? (
          <p className="contact-form-fallback" role="status">
            WhatsApp did not open? <a href={preparedLink} target="_blank" rel="noreferrer">Open your prepared message here <ArrowUpRight size={13} /></a>
          </p>
        ) : null}
      </form>
    </div>
  );
}
