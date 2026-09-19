import Image from "next/image";
import Hero from "./components/Hero";
import SiteNav from "./components/SiteNav";
import Reveal from "./components/Reveal";
import ReelsRail from "./components/ReelsRail";
import FilmStrip from "./components/FilmStrip";
import Marquee from "./components/Marquee";
import WorkGallery from "./components/WorkGallery";
import {
  blurFor,
  categories,
  philosophy,
  sectors,
  services,
  statementImage,
  studio,
  studioImage,
} from "./content";

const year = new Date().getFullYear();

export default function Home() {
  return (
    <>
      <SiteNav />

      <main id="top" className="flex-1">
        <Hero />

        {/* ── Studio statement ─────────────────────────────────────────── */}
        <section className="section-y bg-ivory">
          <div className="shell grid gap-10 md:grid-cols-12 md:gap-12">
            <Reveal className="md:col-span-4">
              <p className="type-caption text-bronze">The Studio</p>
              {/* Sits under the eyebrow rather than in a column of its own, so
                  the existing 4/8 split and the stats grid on the right are
                  left untouched. */}
              <div
                className="relative mt-8 w-full overflow-hidden bg-stone"
                style={{ aspectRatio: "4 / 5" }}
              >
                <Image
                  src={statementImage.src}
                  alt={statementImage.alt}
                  fill
                  quality={75}
                  placeholder={blurFor(statementImage.src) ? "blur" : "empty"}
                  blurDataURL={blurFor(statementImage.src)}
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <div className="md:col-span-8">
              <Reveal>
                <p className="type-heading text-balance">
                  Before anyone walks into a space, they have already seen it.
                </p>
              </Reveal>
              <Reveal delay={90}>
                <p className="type-body mt-8 max-w-2xl text-sage">
                  A luxury hotel, a residential project, a commercial floor, a
                  heritage property — the decision starts with a photograph.
                  Architectural photography stops being documentation at that
                  point and becomes the first impression a property ever makes.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-stone pt-10 sm:grid-cols-3">
                  {[
                    { k: "60,000×", v: "faster visual processing than text" },
                    { k: "90%", v: "of information processed is visual" },
                    { k: "2–5 days", v: "on site, depending on the property" },
                  ].map((s) => (
                    <div key={s.k}>
                      <dt className="type-stat text-charcoal">{s.k}</dt>
                      <dd className="type-body mt-2 text-sage">{s.v}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Selected work ────────────────────────────────────────────── */}
        <section id="work" className="section-y relative overflow-hidden bg-greige">
          <FilmStrip side="left" />
          <div className="shell relative">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6 border-b border-stone pb-6">
                <div>
                  <p className="type-caption mb-4 text-bronze">Selected Work</p>
                  <h2 className="type-heading max-w-lg text-balance">
                    Spaces, as they are meant to be seen.
                  </h2>
                </div>
                <p className="type-caption max-w-xs text-sage">
                  {categories.slice(0, 6).join(" · ")}
                </p>
              </div>
            </Reveal>

            <WorkGallery />
          </div>
        </section>

        {/* ── Films ────────────────────────────────────────────────────── */}
        <ReelsRail />

        {/* ── Services ─────────────────────────────────────────────────── */}
        <section id="services" className="section-y relative overflow-hidden bg-ivory">
          <FilmStrip side="right" />
          <div className="shell relative grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <p className="type-caption mb-4 text-bronze">What We Do</p>
                <h2 className="type-heading text-balance">
                  Four ways we tell a property&apos;s story.
                </h2>
              </Reveal>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <ul>
                {services.map((service, i) => (
                  <Reveal as="li" key={service.index} delay={i * 70}>
                    <div className="group grid grid-cols-[auto_1fr] gap-x-6 border-t border-stone py-8 md:gap-x-10 md:py-10">
                      <span className="type-caption pt-1.5 text-bronze">
                        {service.index}
                      </span>
                      <div>
                        <h3 className="type-subheading transition-colors duration-500 group-hover:text-bronze">
                          {service.title}
                        </h3>
                        <p className="type-body mt-3 max-w-xl text-sage">
                          {service.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Philosophy ───────────────────────────────────────────────── */}
        {/* FilmStrip sits on the right here, not the left: the studio plate now
            occupies the left column, and the strip is a 84px-wide absolute
            overlay at the viewport edge that would collide with it on mid-size
            screens (the shell's 2.5rem gutter is narrower than the strip). */}
        <section id="studio" className="section-y relative overflow-hidden bg-greige">
          <FilmStrip side="right" />
          <div className="shell relative grid items-start gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Reveal>
                <div
                  className="relative w-full overflow-hidden bg-stone"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <Image
                    src={studioImage.src}
                    alt={studioImage.alt}
                    fill
                    quality={75}
                    placeholder={blurFor(studioImage.src) ? "blur" : "empty"}
                    blurDataURL={blurFor(studioImage.src)}
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal>
                <p className="type-caption mb-4 text-bronze">{philosophy.eyebrow}</p>
                <p className="type-heading mb-10 text-balance">{philosophy.lead}</p>
              </Reveal>
              {philosophy.paragraphs.map((para, i) => (
                // Spacing lives on the Reveal wrapper: the <p> is an only child,
                // so `last:` on it would match every paragraph and zero them all.
                <Reveal key={i} delay={i * 80} className="mb-6 last:mb-0">
                  <p className="type-body text-sage">{para}</p>
                </Reveal>
              ))}
              <Reveal delay={260}>
                <div className="mt-12 border-t border-stone pt-8">
                  <p className="type-caption text-sage">{studio.reach}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Sectors marquee ──────────────────────────────────────────── */}
        <section className="border-y border-stone bg-ivory py-14 md:py-20">
          <div className="shell mb-10">
            <p className="type-caption text-center text-bronze">Who We Work With</p>
          </div>
          <Marquee items={sectors} />
        </section>

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <section id="contact" className="section-y bg-ivory">
          <div className="shell">
            <Reveal>
              <p className="type-caption mb-6 text-bronze">Start a Conversation</p>
              <h2 className="type-heading max-w-4xl text-balance">
                Tell us about the space.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-stone pt-10">
                <a
                  href={studio.phoneHref}
                  className="type-stat transition-colors duration-500 hover:text-bronze"
                >
                  {studio.phone}
                </a>
                <a
                  href={studio.phoneHref}
                  className="type-caption border border-charcoal px-8 py-4 transition-colors duration-500 hover:bg-charcoal hover:text-ivory"
                >
                  Enquire
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-stone bg-charcoal">
        <div className="shell py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <Image
                src="/logo.png"
                alt={studio.name}
                width={132}
                height={106}
                quality={90}
                className="h-auto w-[104px] invert"
              />
              <p className="type-body mt-6 max-w-sm text-sage">{studio.statement}</p>
            </div>

            <div className="md:col-span-3 md:col-start-7">
              <p className="type-caption mb-5 text-bronze">Studio</p>
              <p className="type-body text-sage">{studio.basedIn}</p>
              <a
                href={studio.phoneHref}
                className="type-body mt-2 block text-bronze transition-colors hover:text-charcoal"
              >
                {studio.phone}
              </a>
            </div>

            <div className="md:col-span-3">
              <p className="type-caption mb-5 text-bronze">Categories</p>
              <ul className="type-body columns-2 gap-6 text-sage">
                {categories.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-stone pt-8">
            <p className="type-caption text-sage">
              © {year} {studio.name.toUpperCase()}
            </p>
            <p className="type-caption text-sage">{studio.tagline}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
