import Image from "next/image";
import Lockup from "./Lockup";

/** Copy condensed from the manual, p.4 "DE CE EXISTĂ UTOPIA?" and
 *  p.5 "CE ÎNSEAMNĂ ASTA, PRACTIC", rewritten for a customer rather than
 *  for the internal team. Tone per p.6: direct, warm, confident, dry. */

const PILLARS = [
  "Ne place puiul prăjit cu personalitate. Cu o crustă care se aude de la prima mușcătură, condimente cât trebuie și gust care nu trece neobservat. La Utopia, asta e regula de bază.",
  "Folosim pui românesc și punem accent pe ceea ce contează: gust, textură și porții care îți fac poftă. Nu încercăm să reinventăm mâncarea. Vrem doar să facem un fried chicken pe care să-l ții minte.",
  "Fie că vii pentru un burger, crispy sau aripioare de pui, știi ce cauți. Ceva bun, crocant și făcut să fie savurat. Ne găsești în Arad și Timișoara.",
];

export default function About() {
  return (
    <section
      id="despre"
      className="relative overflow-hidden bg-u-red py-20 text-u-white md:py-28"
    >
      <div
        className="u-blob -right-[30vw] -top-[26vh] h-[52vh] w-[52vh] md:-right-[18vw] md:-top-[30vh] md:h-[64vh] md:w-[64vh]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="u-eyebrow mb-5 text-u-white/70">Despre</p>
        <Lockup
          as="h2"
          size="lg"
          lines={[
            { text: "Pui prăjit", tone: "white", tilt: -2 },
            { text: "Fără scuze.", tone: "black", tilt: 1.3 },
          ]}
        />

        {/* The manual sets its own pull quotes as two yellow slashes beside
            bold italic slab type. Same treatment here. */}
        <figure className="mt-16 flex items-start gap-5 md:mt-20 md:gap-7">
          <span aria-hidden className="mt-1 flex shrink-0 gap-1.5 md:mt-2">
            <span className="block h-[clamp(2rem,5vw,3.4rem)] w-[clamp(0.5rem,1.2vw,0.85rem)] -skew-x-12 bg-u-yellow" />
            <span className="block h-[clamp(2rem,5vw,3.4rem)] w-[clamp(0.5rem,1.2vw,0.85rem)] -skew-x-12 bg-u-yellow" />
          </span>
          <blockquote className="max-w-[26ch] text-[clamp(1.35rem,3.4vw,2.624rem)] font-bold italic leading-[1.12] text-u-yellow md:max-w-[30ch]">
            „Mai puține vorbe. Mai mult crunch.”
          </blockquote>
        </figure>

        <div className="relative mt-28 grid grid-cols-1 gap-px border-[3px] border-u-black bg-u-black md:mt-24 md:grid-cols-3">
          {PILLARS.map((text) => (
            <div
              key={text}
              data-reveal="card"
              className="u-hidden bg-u-red px-7 py-10 md:px-10 md:py-14"
            >
              <p className="text-justify hyphens-auto text-[clamp(1.2rem,1.7vw,1.45rem)] leading-[1.5]">
                {text}
              </p>
            </div>
          ))}

          {/* p.11 — the mascot belongs anywhere the brand speaks. */}
          <Image
            src="/brand/m-recline.svg"
            alt=""
            width={424}
            height={238}
            className="pointer-events-none absolute -top-[64px] right-4 w-[160px] md:-top-[126px] md:right-10 md:w-[260px]"
          />
        </div>
      </div>
    </section>
  );
}
