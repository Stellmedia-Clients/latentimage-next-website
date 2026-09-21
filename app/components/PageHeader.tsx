import Reveal from "./Reveal";

/**
 * Masthead for the inner routes. They open on the page background rather than
 * a full-height video, so the top padding here is what clears the fixed nav.
 */
export default function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string | string[];
}) {
  const paragraphs = lead === undefined ? [] : Array.isArray(lead) ? lead : [lead];

  return (
    <header className="shell pt-32 pb-16 md:pt-44 md:pb-24">
      <Reveal>
        <p className="type-caption mb-6 text-bronze">{eyebrow}</p>
        <h1 className="type-heading max-w-4xl text-balance">{title}</h1>
      </Reveal>
      {paragraphs.map((para, i) => (
        <Reveal key={i} delay={80 + i * 70} className="mt-6 first:mt-10">
          <p className="type-body max-w-2xl text-sage">{para}</p>
        </Reveal>
      ))}
    </header>
  );
}
