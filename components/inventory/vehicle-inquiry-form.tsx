"use client";

import { type FormEvent, useState } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

const destinations = [
  "Pakistan", "Kenya", "Tanzania", "Uganda", "Zambia", "Zimbabwe", "South Africa",
  "Ghana", "Nigeria", "Guyana", "Jamaica", "Trinidad and Tobago", "UAE", "Australia",
  "New Zealand", "Other / To be confirmed",
];

export function VehicleInquiryForm({ vehicleName, reference, available }: { vehicleName: string; reference: string; available: boolean }) {
  const [destination, setDestination] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(available
    ? "Please share the current availability, vehicle details and export quotation."
    : "This listing is not currently marked available. Please suggest similar vehicles or sourcing options.");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = [
      available
        ? `Hello Wazir Trading LLC, I am interested in ${vehicleName}.`
        : `Hello Wazir Trading LLC, I found your ${vehicleName} listing and would like to ask about similar available vehicles or sourcing options.`,
      `Vehicle reference: ${reference}`,
      `Name: ${name.trim()}`,
      `Contact number: ${phone.trim()}`,
      `Destination: ${destination}`,
      `Message: ${message.trim() || "Please provide further details."}`,
    ].join("\n");
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="vehicle-inquiry-form" onSubmit={submit}>
      <div className="vehicle-inquiry-heading">
        <span className="vehicle-inquiry-kicker">Vehicle enquiry</span>
        <h2>{available ? "Interested in this vehicle?" : "Looking for a similar vehicle?"}</h2>
        <p>{available
          ? "Tell us where you plan to import it. We will discuss availability and the export quotation with you."
          : "This record is not currently listed as available. Tell us your destination and we can discuss similar stock or sourcing options."}</p>
      </div>
      <label className="vehicle-form-field">
        <span>Your name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} autoComplete="name" placeholder="Full name" />
      </label>
      <label className="vehicle-form-field">
        <span>WhatsApp / phone number</span>
        <input value={phone} onChange={(event) => setPhone(event.target.value)} required maxLength={40} autoComplete="tel" placeholder="Include country code" />
      </label>
      <label className="vehicle-form-field">
        <span>Destination country</span>
        <select value={destination} onChange={(event) => setDestination(event.target.value)} required>
          <option value="">Select your country</option>
          {destinations.map((country) => <option key={country} value={country}>{country}</option>)}
        </select>
      </label>
      <label className="vehicle-form-field">
        <span>Message (optional)</span>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} maxLength={500} />
      </label>
      <button type="submit" className="button button-primary vehicle-inquiry-submit"><MessageCircle size={17} /> Continue on WhatsApp <ArrowUpRight size={16} /></button>
      <p className="vehicle-inquiry-privacy">Your information is placed in a WhatsApp draft. This form does not store or send it automatically.</p>
    </form>
  );
}
