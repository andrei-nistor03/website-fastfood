import type { Metadata, Viewport } from "next";
import "./globals.css";
import Loader from "@/components/Loader";

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
  icons: { icon: "/brand/m-stand.svg", type: "image/svg+xml" },
};

export const viewport: Viewport = {
  themeColor: "#e10019",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        {/* Opt in to the entrance animations only when scripting is available
            and the visitor has not asked for reduced motion. Without this class
            nothing is ever hidden, so the page reads either way. The loader
            gate is unconditional — it doesn't depend on motion preference,
            only on there being a script around to ever clear it again. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js-loading');" +
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)" +
              "document.documentElement.classList.add('js-motion')",
          }}
        />
      </head>
      <body>
        <Loader />
        {children}
      </body>
    </html>
  );
}
