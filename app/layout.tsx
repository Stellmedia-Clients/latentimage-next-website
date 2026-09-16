import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

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
    default: "LatentImage — Architectural & Hospitality Photography",
    template: "%s · LatentImage",
  },
  description:
    "We create visual assets that help architecture, hospitality and real-estate brands sell their spaces. Photography, cinematic films and brand communication.",
  openGraph: {
    title: "LatentImage — Architectural & Hospitality Photography",
    description:
      "We create visual assets that help architecture, hospitality and real-estate brands sell their spaces.",
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
        {children}
      </body>
    </html>
  );
}
