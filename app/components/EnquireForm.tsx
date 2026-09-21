"use client";

import { useState, type FormEvent } from "react";
import { enquirePage } from "../copy";

/**
 * The site builds as a static export (`output: "export"` in next.config.ts),
 * so there is no server to post to and no route handler or server action is
 * available. Submission therefore goes to a third party.
 *
 * Netlify Forms is wired up here: the build bot registers any form in the
 * emitted HTML that carries `data-netlify`, and this component is server-
 * rendered into that HTML, so it is picked up. Posting over fetch rather than
 * letting the browser navigate keeps the visitor on the page and lets the
 * success state render inline.
 *
 * NB: this only works on Netlify. If the deploy target moves — the Dockerfile
 * and .woodpecker.yml in the repo suggest a container build is also in play —
 * point FORM_ENDPOINT at Formspree or similar and drop the two hidden inputs.
 */
const FORM_NAME = "enquiry";
const FORM_ENDPOINT = "/";

export default function EnquireForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");

    const data = new FormData(form);
    data.set("form-name", FORM_NAME);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(
          data as unknown as Record<string, string>,
        ).toString(),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="border-t border-stone pt-10"
        role="status"
        aria-live="polite"
      >
        <p className="type-caption mb-4 text-bronze">Enquiry received</p>
        <p className="type-heading max-w-xl text-balance">
          Thank you — we will be in touch shortly.
        </p>
        <p className="type-body mt-6 max-w-md text-sage">
          We read every enquiry personally and usually respond within two
          working days.
        </p>
      </div>
    );
  }

  return (
    <form
      name={FORM_NAME}
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      className="border-t border-stone pt-10"
    >
      {/* Netlify needs the form's name posted back with the body, and the
          honeypot is a field a human never sees and a bot fills in. */}
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hidden">
        <label>
          Do not fill this in <input name="bot-field" tabIndex={-1} />
        </label>
      </p>

      <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
        <Field label="Company or property" name="company" autoComplete="organization" />

        <label className="block md:col-span-2">
          <span className="type-caption text-sage">What do you need?</span>
          <select
            name="projectType"
            defaultValue=""
            required
            className="type-body mt-3 w-full appearance-none border-b border-stone bg-transparent py-3 text-charcoal outline-none transition-colors focus:border-bronze"
          >
            <option value="" disabled>
              Select a service
            </option>
            {enquirePage.projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="type-caption text-sage">
            Tell us about the project
          </span>
          <textarea
            name="message"
            rows={5}
            required
            placeholder="The property, the timeline, what you are hoping the content will do."
            className="type-body mt-3 w-full resize-y border-b border-stone bg-transparent py-3 text-charcoal outline-none transition-colors placeholder:text-sage/60 focus:border-bronze"
          />
        </label>
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={status === "sending"}
          className="type-caption border border-charcoal px-8 py-4 transition-colors duration-500 hover:bg-charcoal hover:text-ivory disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send Enquiry"}
        </button>

        <p className="type-caption text-sage" role="status" aria-live="polite">
          {status === "error"
            ? "Something went wrong. Please try again, or call us directly."
            : ""}
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="type-caption text-sage">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="type-body mt-3 w-full border-b border-stone bg-transparent py-3 text-charcoal outline-none transition-colors focus:border-bronze"
      />
    </label>
  );
}
