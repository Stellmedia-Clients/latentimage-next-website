import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import PageHeader from "../components/PageHeader";
import CtaLink from "../components/CtaLink";
import { journalPage } from "../copy";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Observations, ideas, stories and perspectives from the world of places and visual culture.",
};

/**
 * Listing only. There is deliberately no [slug] route yet: a static export
 * needs generateStaticParams to prerender dynamic segments, and there are no
 * real posts to enumerate — the cards below are layout placeholders and say so
 * on screen.
 */
export default function Journal() {
  return (
    <>
      <PageHeader
        eyebrow={journalPage.eyebrow}
        title={journalPage.title}
        lead={journalPage.lead}
      />

      <section className="shell pb-24 md:pb-32">
        <div className="grid gap-x-8 gap-y-12 border-t border-stone pt-12 md:grid-cols-3">
          {journalPage.posts.map((post, i) => (
            <Reveal key={post.title} delay={i * 80}>
              <article>
                <div className="flex items-center gap-3">
                  <span className="type-caption text-bronze">{post.topic}</span>
                  <span
                    className="type-caption border border-stone px-2 py-1 text-sage"
                    style={{ fontSize: "0.6rem" }}
                  >
                    Placeholder
                  </span>
                </div>
                <h2 className="type-subheading mt-4 text-charcoal">
                  {post.title}
                </h2>
                <p className="type-body mt-3 text-sage">{post.excerpt}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-y bg-greige">
        <div className="shell">
          <Reveal>
            <h2 className="type-heading max-w-2xl text-balance">
              The journal is being written.
            </h2>
            <p className="type-body mt-8 max-w-xl text-sage">
              In the meantime, the work itself is the best account of how we
              think about places and how they are photographed.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 flex flex-wrap gap-4 border-t border-stone pt-10">
              <CtaLink href="/projects" variant="solid">
                Explore Our Work
              </CtaLink>
              <CtaLink href="/studio">Visit the Studio</CtaLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
