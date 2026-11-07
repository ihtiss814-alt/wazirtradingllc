"use client";

import { type FormEvent, useState } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

const makes = ["Toyota", "Honda", "Nissan", "Suzuki", "Mazda", "Mitsubishi", "Subaru", "Daihatsu", "Lexus", "Other / Not sure"];
const destinations = [
  "Pakistan", "Kenya", "Tanzania", "Uganda", "Zambia", "Zimbabwe", "South Africa",
  "Ghana", "Nigeria", "Guyana", "Jamaica", "Trinidad and Tobago", "UAE", "New Zealand",
  "Australia", "Other / To be confirmed",
];

export function LeadRequestForm() {
  const [make, setMake] = useState("Toyota");
  const [model, setModel] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      "Hello Wazir Trading LLC, I would like to enquire about a Japanese used vehicle.",
      `Preferred make: ${make}`,
      `Model: ${model.trim() || "Open to recommendations"}`,
      `Destination country: ${destination || "Please discuss"}`,
      `Budget: ${budget.trim() || "To be discussed"}`,
      `Additional details: ${details.trim() || "None"}`,
    ].join("\n");
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <div className="form-intro">
        <span className="eyebrow eyebrow-light">Tell us what you need</span>
        <h2>Looking for a particular vehicle?</h2>
        <p>Share the basics. Your request will open as a prepared WhatsApp message so you can review it before sending.</p>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Preferred make</span>
          <select value={make} onChange={(event) => setMake(event.target.value)}>
            {makes.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Model (optional)</span>
          <input value={model} onChange={(event) => setModel(event.target.value)} placeholder="e.g. Prius, Aqua, Vezel" maxLength={80} />
        </label>
        <label className="field">
          <span>Destination country</span>
          <select value={destination} onChange={(event) => setDestination(event.target.value)}>
            <option value="">Select destination</option>
            {destinations.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Approximate budget (optional)</span>
          <input value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="e.g. USD 8,000" maxLength={60} />
        </label>
        <label className="field field-wide">
          <span>Anything else we should know? (optional)</span>
          <textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Year range, transmission, fuel type, or other preferences" rows={3} maxLength={500} />
        </label>
      </div>

      <div className="form-submit-row">
        <button className="button button-primary" type="submit">
          <MessageCircle size={17} /> Continue on WhatsApp <ArrowUpRight size={16} />
        </button>
        <span>Your details are not stored on this website.</span>
      </div>
    </form>
  );
}
