import type { Metadata, Viewport } from "next";
import "@fontsource-variable/figtree";
import "@fontsource/zilla-slab/400.css";
import "@fontsource/zilla-slab/400-italic.css";
import "@fontsource/zilla-slab/500.css";
import "@fontsource/zilla-slab/700.css";
import "@fontsource/zilla-slab/700-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://utopiafriedchicken.ro"),
  title: "Utopia Fried Chicken — Pui prăjit. Fără scuze.",
  description:
    "Pui prăjit făcut cum trebuie, în Arad și Timișoara. Burgeri, buckets, aripioare și crispy strips. Porții oneste, servit repede.",
  openGraph: {
    title: "Utopia Fried Chicken",
    description: "Pui prăjit. Fără scuze. Arad și Timișoara.",
    locale: "ro_RO",
    type: "website",
  },
  icons: { icon: "/brand/logo-light.png" },
};

export const viewport: Viewport = {
  themeColor: "#e10019",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro">
      <head>
        {/* Opt in to the entrance animations only when scripting is available
            and the visitor has not asked for reduced motion. Without this class
            nothing is ever hidden, so the page reads either way. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)" +
              "document.documentElement.classList.add('js-motion')",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
