import Image from "next/image";
import Link from "next/link";
import { nav, studio } from "../content";

/**
 * Shared across every route, so it lives in the layout rather than the page.
 *
 * The logo stays the stacked mark here — the wordmark swap was for the header,
 * where the lockup has to read at nav height.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone bg-charcoal">
      <div className="shell py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image
              src="/logo.png"
              alt={studio.name}
              width={132}
              height={106}
              unoptimized
              className="h-auto w-[104px] invert"
            />
            <p className="type-body mt-6 max-w-sm text-sage">
              Visual storytelling for architecture and luxury hospitality.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="type-caption mb-5 text-bronze">Studio</p>
            <p className="type-body text-sage">{studio.basedIn}</p>
            <a
              href={studio.phoneHref}
              className="type-body mt-2 block text-bronze transition-colors hover:text-ivory"
            >
              {studio.phone}
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="type-caption mb-5 text-bronze">Sitemap</p>
            <ul className="type-body space-y-2 text-sage">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-ivory"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-sage/25 pt-8">
          <p className="type-caption text-sage">
            © {year} {studio.name.toUpperCase()}
          </p>
          <p className="type-caption text-sage">
            Photography • Films • Digital Content • Immersive Experiences
          </p>
        </div>
      </div>
    </footer>
  );
}
