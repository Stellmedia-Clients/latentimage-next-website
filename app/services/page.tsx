import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import PageHeader from "../components/PageHeader";
import Accordion from "../components/Accordion";
import FilmStrip from "../components/FilmStrip";
import CtaLink from "../components/CtaLink";
import { servicesPage } from "../copy";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Photography, brand films, advertising films, social content, AI visuals and immersive experiences for hospitality, architecture and real estate.",
};

export default function Services() {
  const panels = servicesPage.items.map((service) => ({
    title: (
      <>
        <span className="type-subheading block">{service.title}</span>
        <span className="type-body mt-2 block max-w-xl text-sage">
          {service.short}
        </span>
      </>
    ),
    body: (
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="type-body text-sage">{service.expanded}</p>
          {service.note && (
            <p className="type-caption mt-6 max-w-md leading-relaxed text-bronze">
              {service.note}
            </p>
          )}
          <CtaLink href="/enquire" className="mt-8">
            {service.cta}
          </CtaLink>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <p className="type-caption mb-5 text-bronze">Deliverables</p>
          <ul className="type-body space-y-2 text-sage">
            {service.deliverables.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-stone" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  }));

  return (
    <>
      <PageHeader
        eyebrow={servicesPage.eyebrow}
        title={servicesPage.title}
        lead={servicesPage.lead}
      />

      <section className="section-y relative overflow-hidden bg-greige pt-0 md:pt-0">
        <FilmStrip side="right" />
        <div className="shell relative">
          <Reveal>
            <Accordion items={panels} />
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-ivory">
        <div className="shell">
          <Reveal>
            <p className="type-caption mb-6 text-bronze">Enquire</p>
            <h2 className="type-heading max-w-3xl text-balance">
              Not sure which of these you need?
            </h2>
            <p className="type-body mt-8 max-w-xl text-sage">
              Tell us about the property, the audience and what the content has
              to achieve — we will propose the right combination.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 border-t border-stone pt-10">
              <CtaLink href="/enquire" variant="solid">
                Start a Conversation
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
