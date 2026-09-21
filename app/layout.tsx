import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";

// Display serif — homepage statement, section headings, case-study titles only.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

// Everything else — nav, paragraphs, buttons, captions, metadata.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.latentimage.in"),
  title: {
    default: "LatentImage — Visual Storytelling for Architecture & Luxury Hospitality",
    template: "%s · LatentImage",
  },
  description:
    "LATENTIMAGE partners with leading hospitality and real estate brands to transform spaces and experiences into compelling visual content — photography, films, digital content and immersive experiences.",
  openGraph: {
    title: "LatentImage — Visual Storytelling for Architecture & Luxury Hospitality",
    description:
      "Photography, films, digital content and immersive experiences for leading hospitality and real estate brands.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f1eb",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal">
        <SiteNav />
        <main id="top" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
