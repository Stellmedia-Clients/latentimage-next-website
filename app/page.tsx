import Hero from "./components/Hero";
import Reveal from "./components/Reveal";
import StatsBand from "./components/StatsBand";
import Accordion from "./components/Accordion";
import Marquee from "./components/Marquee";
import ShortsRail from "./components/ShortsRail";
import FilmStrip from "./components/FilmStrip";
import CtaLink from "./components/CtaLink";
import { brands, whatWeDo, whyBrands } from "./copy";

/**
 * Home. Section order follows the brief: hero, figures, what we do, the client
 * list, short-form work, then the case for working with the studio.
 *
 * Accordion bodies are built here rather than in copy.ts because they are
 * markup, not prose — copy.ts is a .ts module and holds no JSX.
 */
export default function Home() {
  const whatWeDoPanels = whatWeDo.items.map((item) => ({
    title: item.title,
    body: <p className="type-body max-w-2xl text-sage">{item.body}</p>,
  }));

  const whyPanels = [
    {
      title: whyBrands.partnership.title,
      body: (
        <div className="grid gap-10 md:grid-cols-2">
          {whyBrands.partnership.models.map((model) => (
            <div key={model.name}>
              <p className="type-caption text-bronze">{model.kicker}</p>
              <h4 className="type-subheading mt-3 text-charcoal">{model.name}</h4>
              <p className="type-body mt-3 text-charcoal">{model.lead}</p>
              <p className="type-body mt-3 text-sage">{model.body}</p>
              <p className="type-caption mt-5 text-sage">
                Ideal for: {model.idealFor}
              </p>
            </div>
          ))}
        </div>
      ),
    },
    ...whyBrands.panels.map((panel) => ({
      title: panel.title,
      body: (
        <div className="max-w-2xl space-y-4">
          {panel.paragraphs.map((para, i) => (
            <p key={i} className="type-body text-sage">
              {para}
            </p>
          ))}
        </div>
      ),
    })),
  ];

  return (
    <>
      <Hero />
      <StatsBand />

      {/* ── What we do ───────────────────────────────────────────────── */}
      <section className="section-y relative overflow-hidden bg-greige">
        <FilmStrip side="left" />
        <div className="shell relative grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="type-caption mb-4 text-bronze">{whatWeDo.eyebrow}</p>
              <h2 className="type-heading text-balance">{whatWeDo.headline}</h2>
              <p className="type-body mt-8 max-w-md text-sage">{whatWeDo.body}</p>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={90}>
              <Accordion items={whatWeDoPanels} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Client brands ────────────────────────────────────────────── */}
      {/* Charcoal, not ivory: several of the supplied logos are white-on-
          transparent artwork, and the whole set is normalised to white here. */}
      <section className="bg-charcoal py-16 md:py-20">
        <div className="shell mb-12">
          <p className="type-caption text-center text-bronze">
            Brands we work with
          </p>
        </div>
        <Marquee items={brands} />
      </section>

      <ShortsRail />

      {/* ── Why brands work with us ──────────────────────────────────── */}
      {/* `overflow-clip`, not `overflow-hidden`: hidden would make this section
          the scrollport for the sticky left column below and silently kill the
          pin. Clip still contains the FilmStrip without creating one. */}
      <section className="section-y relative overflow-clip bg-ivory">
        <FilmStrip side="right" />
        <div className="shell relative grid items-start gap-12 md:grid-cols-12">
          {/* Pinned from below the fixed nav (~3.75rem tall) so the panels on
              the right scroll past it on their own until they run out. */}
          <div className="md:sticky md:top-24 md:col-span-5">
            <Reveal>
              <p className="type-caption mb-4 text-bronze">{whyBrands.eyebrow}</p>
              <h2 className="type-heading text-balance">{whyBrands.headline}</h2>
              <p className="type-body mt-8 max-w-md text-sage">{whyBrands.body}</p>
              <CtaLink href={whyBrands.cta.href} className="mt-10">
                {whyBrands.cta.label}
              </CtaLink>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={90}>
              <h3 className="type-subheading text-charcoal">
                {whyBrands.story.title}
              </h3>
              <p className="type-body mt-4 max-w-2xl text-sage">
                {whyBrands.story.body}
              </p>
            </Reveal>
            <Reveal delay={160} className="mt-12 block">
              <Accordion single items={whyPanels} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Enquire ──────────────────────────────────────────────────── */}
      <section className="section-y bg-greige">
        <div className="shell">
          <Reveal>
            <p className="type-caption mb-6 text-bronze">Enquire</p>
            <h2 className="type-heading max-w-3xl text-balance">
              Tell us about your property, project or creative ambition.
            </h2>
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
