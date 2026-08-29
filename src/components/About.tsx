import Image from "next/image";
import Lockup from "./Lockup";

/** Copy condensed from the manual, p.4 "DE CE EXISTĂ UTOPIA?" and
 *  p.5 "CE ÎNSEAMNĂ ASTA, PRACTIC", rewritten for a customer rather than
 *  for the internal team. Tone per p.6: direct, warm, confident, dry. */

const PILLARS = [
  {
    title: "Prăjim la comandă",
    body: "Nu ținem pui sub lampă. Se prăjește când îl comanzi, se servește cât e fierbinte.",
  },
  {
    title: "Porții oneste",
    body: "Cât scrie în meniu, atât primești. Fără fotografii care promit altceva decât e în cutie.",
  },
  {
    title: "Fără povești",
    body: "Nu ne cerem scuze că suntem fast-food și nu pretindem că suntem altceva.",
  },
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
            { text: "Pui prăjit.", tone: "white", tilt: -2 },
            { text: "Fără scuze.", tone: "black", tilt: 2.5 },
          ]}
        />

        <div className="mt-14 grid grid-cols-1 gap-9 md:grid-cols-3 md:gap-12">
          <p className="text-[1.05rem] leading-[1.6]">
            <strong className="font-bold">
              Puiul prăjit în România are o problemă:
            </strong>{" "}
            toată lumea se străduiește prea mult să pară altceva decât e.
            Lanțurile mari servesc același pui, cu același zâmbet, de la
            București la Bangkok.
          </p>
          <p className="text-[1.05rem] leading-[1.6]">
            La celălalt capăt, fiecare sandviș vine învelit în hârtie kraft și
            într-o poveste despre proveniență. Noi stăm în spațiul pe care nu îl
            ocupă niciunul — cel în care mâncarea e lucrul esențial.
          </p>
          <p className="text-[1.05rem] leading-[1.6]">
            Puiul prăjit nu trebuie să fie apologetic sau rafinat ca să fie bun.{" "}
            <em className="font-bold italic">
              Trebuie să fie picant, suficient și sincer.
            </em>{" "}
            Asta facem, în Arad și în Timișoara.
          </p>
        </div>

        {/* The manual sets its own pull quotes as two yellow slashes beside
            bold italic slab type. Same treatment here. */}
        <figure className="mt-16 flex items-start gap-5 md:mt-20 md:gap-7">
          <span aria-hidden className="mt-1 flex shrink-0 gap-1.5 md:mt-2">
            <span className="block h-[clamp(2rem,5vw,3.4rem)] w-[clamp(0.5rem,1.2vw,0.85rem)] -skew-x-12 bg-u-yellow" />
            <span className="block h-[clamp(2rem,5vw,3.4rem)] w-[clamp(0.5rem,1.2vw,0.85rem)] -skew-x-12 bg-u-yellow" />
          </span>
          <blockquote className="max-w-[26ch] text-[clamp(1.35rem,3.4vw,2.624rem)] font-bold italic leading-[1.12] text-u-yellow md:max-w-[30ch]">
            Porțiile sunt oneste, serviciul este rapid, iar experiența nu îți
            cere să participi la o poveste.
          </blockquote>
        </figure>

        <div className="relative mt-28 grid grid-cols-1 gap-px border-[3px] border-u-black bg-u-black md:mt-24 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              data-reveal="card"
              className="u-hidden bg-u-red px-6 py-8 md:px-8 md:py-10"
            >
              <h3 className="text-[clamp(1.35rem,2.6vw,1.62rem)]">{p.title}</h3>
              <p className="mt-3 text-[0.98rem] leading-[1.5] text-u-white/85">
                {p.body}
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
