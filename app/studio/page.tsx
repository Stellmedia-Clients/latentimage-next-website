import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import PageHeader from "../components/PageHeader";
import FilmStrip from "../components/FilmStrip";
import CtaLink from "../components/CtaLink";
import { studioPage as s } from "../copy";
import { Arrow } from "../components/ui/Icons";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "The people, philosophy and perspective behind LATENTIMAGE — a visual creative studio working across architecture, hospitality, real estate and lifestyle.",
};

export default function Studio() {
  return (
    <>
      <PageHeader eyebrow={s.eyebrow} title={s.title} lead={s.lead} />

      {/* Supplied as a slot in the brief ("A BTS Video") with no asset behind
          it yet. Rendered as a labelled placeholder rather than filled with
          stock that would misrepresent the studio. */}
      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <MediaSlot ratio="16 / 9" label="Behind the scenes film" />
        </Reveal>
      </section>

      {/* ── Our perspective ──────────────────────────────────────────── */}
      <section className="section-y relative overflow-hidden bg-greige">
        <FilmStrip side="right" />
        <div className="shell relative grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="type-caption mb-4 text-bronze">
                {s.perspective.eyebrow}
              </p>
              <h2 className="type-heading text-balance">{s.perspective.title}</h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            {s.perspective.paragraphs.map((para, i) => (
              <Reveal key={i} delay={i * 80} className="mb-6 last:mb-0">
                <p className="type-body text-sage">{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-20 md:py-28">
        <Reveal>
          <MediaSlot ratio="3 / 2" label="Studio photograph" />
        </Reveal>
      </section>

      {/* ── Our evolution ────────────────────────────────────────────── */}
      <section className="section-y bg-ivory">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="type-caption mb-4 text-bronze">{s.evolution.eyebrow}</p>
              <h2 className="type-heading text-balance">{s.evolution.title}</h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            {s.evolution.paragraphs.map((para, i) => (
              <Reveal key={i} delay={i * 80} className="mb-6 last:mb-0">
                <p className="type-body text-sage">{para}</p>
              </Reveal>
            ))}
            <Reveal delay={200}>
              <p className="type-subheading mt-8 text-charcoal">
                {s.evolution.closing}
              </p>
            </Reveal>
          </div>
        </div>

        {/* The chain overflows rather than wraps: it reads as one progression,
            and stacking it into two rows breaks that reading. */}
        <div className="mt-16 border-y border-stone md:mt-20">
          <div className="no-scrollbar overflow-x-auto">
            <ol className="flex justify-center w-max min-w-full items-center gap-4 py-6 md:gap-6">
              {s.evolution.chain.map((step, i) => (
                <li key={step} className="flex shrink-0 items-center gap-4 md:gap-6">
                  <span className="type-caption whitespace-nowrap text-charcoal">
                    {step}
                  </span>
                  {i < s.evolution.chain.length - 1 && (
                    <span aria-hidden className="text-bronze">
                      <Arrow size={20} className="mx-3" />
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── What we believe ──────────────────────────────────────────── */}
      <section className="section-y relative overflow-hidden bg-greige">
        <FilmStrip side="left" />
        <div className="shell relative">
          <Reveal>
            <p className="type-caption mb-4 text-bronze">{s.beliefs.eyebrow}</p>
            <h2 className="type-heading max-w-2xl text-balance">
              {s.beliefs.title}
            </h2>
            <p className="type-body mt-6 text-sage">{s.beliefs.lead}</p>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {s.beliefs.items.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 90}>
                <div className="border-t border-stone pt-6">
                  <h3 className="type-subheading text-charcoal">{item.title}</h3>
                  <p className="type-body mt-3 text-sage">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How we work ──────────────────────────────────────────────── */}
      <section className="section-y bg-ivory">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="type-caption mb-4 text-bronze">{s.process.eyebrow}</p>
              <h2 className="type-heading text-balance">{s.process.title}</h2>
              {s.process.paragraphs.map((para, i) => (
                <p key={i} className="type-body mt-6 max-w-md text-sage">
                  {para}
                </p>
              ))}
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <ol>
              {s.process.steps.map((step, i) => (
                <Reveal as="li" key={step.step} delay={i * 70}>
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-stone py-7 md:gap-x-10">
                    <span className="type-caption pt-1.5 text-bronze">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="type-subheading text-charcoal">{step.step}</h3>
                      <p className="type-body mt-2 text-sage">{step.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── The studio today ─────────────────────────────────────────── */}
      <section className="section-y bg-greige">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="type-caption mb-4 text-bronze">{s.today.eyebrow}</p>
              <h2 className="type-heading text-balance">{s.today.title}</h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            {s.today.paragraphs.map((para, i) => (
              <Reveal key={i} delay={i * 80} className="mb-6 last:mb-0">
                <p className="type-body text-sage">{para}</p>
              </Reveal>
            ))}
            <Reveal delay={240}>
              <ul className="mt-10 border-t border-stone">
                {s.today.disciplines.map((discipline) => (
                  <li
                    key={discipline}
                    className="type-subheading border-b border-stone py-4 text-charcoal"
                  >
                    {discipline}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>


    </>
  );
}

/** Placeholder for an asset the brief calls for but did not supply. */
function MediaSlot({ ratio, label }: { ratio: string; label: string }) {
  return (
    <div
      className="flex w-full items-center justify-center border border-stone bg-greige"
      style={{ aspectRatio: ratio }}
    >
      <p className="type-caption text-sage">{label} — coming soon</p>
    </div>
  );
}
