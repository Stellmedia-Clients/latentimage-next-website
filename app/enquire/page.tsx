import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import PageHeader from "../components/PageHeader";
import EnquireForm from "../components/EnquireForm";
import { enquirePage } from "../copy";
import { studio } from "../content";

export const metadata: Metadata = {
  title: "Enquire",
  description:
    "Tell us about your property, project or creative ambition. LATENTIMAGE works with hospitality, architecture and real estate brands across India.",
};

export default function Enquire() {
  return (
    <>
      <PageHeader
        eyebrow={enquirePage.eyebrow}
        title={enquirePage.title}
        lead={enquirePage.lead}
      />

      <section className="shell pb-24 md:pb-32">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Reveal>
              <EnquireForm />
            </Reveal>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <Reveal delay={90}>
              <div className="border-t border-stone pt-10">
                <p className="type-caption mb-5 text-bronze">Speak to us</p>
                <a
                  href={studio.phoneHref}
                  className="type-stat block transition-colors duration-500 hover:text-bronze"
                >
                  {studio.phone}
                </a>

                <p className="type-caption mb-3 mt-12 text-bronze">Studio</p>
                <p className="type-body text-sage">{studio.basedIn}</p>
                <p className="type-body mt-4 text-sage">{studio.reach}</p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
