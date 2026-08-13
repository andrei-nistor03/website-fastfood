import Image from "next/image";
import Lockup from "./Lockup";
import HeroScene from "./HeroScene";
import HeroProductStack from "./HeroProductStack";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-u-red pb-10 pt-28 md:justify-center md:pb-16 md:pt-32"
    >
      {/* p.15 — a fragment of a yellow ellipse, cut by the edge of the frame.
          Never a whole ellipse, never centred. Everything else sits on top. */}
      <div
        className="u-blob right-[-34vw] top-[-16vh] h-[62vh] w-[62vh] md:right-[-20vw] md:top-[-22vh] md:h-[92vh] md:w-[92vh]"
        aria-hidden
      />
      <div
        className="u-blob bottom-[-30vh] left-[-40vw] h-[34vh] w-[34vh] md:bottom-[-32vh] md:left-[-16vw] md:h-[46vh] md:w-[46vh]"
        aria-hidden
      />

      <HeroScene className="pointer-events-none absolute inset-0 z-[1]" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-8 px-5 md:grid-cols-[1.05fr_1fr] md:gap-4 md:px-10">
        <div className="order-2 md:order-1">
          {/* p.13 — the lockup as drawn in the manual: red / black / yellow. */}
          <Lockup
            as="h1"
            size="xl"
            lines={[
              { text: "Real", tone: "white", tilt: -3 },
              { text: "Fried", tone: "black", tilt: 2 },
              { text: "Chicken", tone: "yellow", tilt: -1.5 },
            ]}
          />

          <p
            data-hero="line"
            className="u-hidden mt-7 max-w-[46ch] text-[clamp(1.05rem,2.2vw,1.35rem)] font-medium text-u-white md:mt-9"
          >
            Pui prăjit, făcut cum trebuie, în Arad și Timișoara. Porții oneste,
            servit repede, fără poveste de fundal.
          </p>

          <div data-hero="cta" className="u-hidden mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#meniu"
              className="u-band bg-u-white text-u-black text-[clamp(1.05rem,2.4vw,1.35rem)] transition-transform duration-200 hover:-rotate-2 hover:scale-[1.03]"
            >
              Vezi meniul
            </a>
            <a
              href="#locatii"
              className="u-band border-[3px] border-u-white bg-transparent text-u-white text-[clamp(1.05rem,2.4vw,1.35rem)] transition-transform duration-200 hover:rotate-2 hover:scale-[1.03]"
            >
              Unde ne găsești
            </a>
          </div>
        </div>

        <div data-hero="product" className="relative order-1 md:order-2">
          <HeroProductStack />
        </div>
      </div>

      {/* p.10 — the mascot should be recognisable "de peste drum", in any
          posture, at any scale. Here it points straight at the menu. */}
      <Image
        data-hero="mascot"
        src="/brand/m-point.webp"
        alt=""
        width={640}
        height={800}
        priority
        className="u-hidden pointer-events-none absolute -bottom-1 right-[-5vw] z-[5] w-[34vw] max-w-[250px] origin-bottom md:right-[40%] md:w-[15vw]"
      />

      <a
        href="#meniu"
        aria-label="Sari la meniu"
        className="u-eyebrow absolute bottom-5 right-5 z-10 hidden items-center gap-2 text-u-white/80 transition-colors hover:text-u-yellow md:flex"
      >
        Derulează
        <span className="block h-6 w-[2px] animate-pulse bg-current" />
      </a>
    </section>
  );
}
