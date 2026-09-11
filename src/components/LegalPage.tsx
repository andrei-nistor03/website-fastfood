import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="bg-u-cream px-5 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-205">
          <h1 className="text-[clamp(1.7rem,5vw,2.624rem)] text-u-ink">
            {title}
          </h1>
          <p className="u-eyebrow mt-4 text-u-red">Actualizat la {updated}</p>

          <div className="mt-10 flex flex-col gap-6 text-step-0 leading-[1.7] text-u-ink/85 [&_h2]:mb-2 [&_h2]:text-[1.1rem] [&_h2]:text-u-red [&_p+p]:mt-3 [&_p]:text-justify">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
