"use client";

import Image from "next/image";
import Lockup from "./Lockup";
import HeroScene from "./HeroScene";
import HeroProductStack from "./HeroProductStack";
import { scrollToSection } from "@/lib/scrollToSection";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex flex-col justify-end overflow-hidden bg-u-red pb-24 pt-16 lg:min-h-svh lg:justify-center lg:pb-16 lg:pt-32"
    >
      {/* p.15 — a fragment of a yellow ellipse, cut by the edge of the frame.
          Never a whole ellipse, never centred. Everything else sits on top. */}
      <div
        className="u-blob right-[-34vw] top-[-16vh] h-[62vh] w-[62vh] lg:right-[-20vw] lg:top-[-22vh] lg:h-[92vh] lg:w-[92vh]"
        aria-hidden
      />
      <div
        className="u-blob bottom-[-30vh] left-[-40vw] h-[34vh] w-[34vh] lg:bottom-[-32vh] lg:left-[-16vw] lg:h-[46vh] lg:w-[46vh]"
        aria-hidden
      />

      <HeroScene className="pointer-events-none absolute inset-0 z-[1]" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-8 px-5 lg:grid-cols-[1fr_1.15fr] lg:gap-4 lg:px-10">
        <div className="order-2 lg:order-1">
          {/* p.13 — the lockup as drawn in the manual: red / black / yellow.
              Kept to short, single-phrase lines (no line wider than the
              menu's "Pui prăjit." / "Fără scuze." precedent) so the band
              stays on one row at every viewport — the phrase is long, so
              it runs four lines instead of the usual two or three. */}
          <Lockup
            as="h1"
            size="lg"
            lines={[
              { text: "Cool people", tone: "white", tilt: -3 },
              { text: "eat", tone: "black", tilt: 2 },
              { text: "Fried", tone: "yellow", tilt: -1.5 },
              { text: "chicken", tone: "black", tilt: 2.5 },
            ]}
          />

          <div
            data-hero="cta"
            className="u-hidden mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#meniu"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#meniu");
              }}
              className="inline-block border-[3px] border-u-ink bg-u-yellow px-7 py-4 font-display text-[clamp(1.1rem,2.6vw,1.55rem)] font-black uppercase leading-none tracking-[-0.015em] text-u-black shadow-[6px_6px_0_0_#221e1f] transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#221e1f] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none md:px-9 md:py-5"
            >
              Vezi meniul
            </a>
            <a
              href="#locatii"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#locatii");
              }}
              className="inline-block border-[3px] border-u-white bg-transparent px-7 py-4 font-display text-[clamp(1.1rem,2.6vw,1.55rem)] font-black uppercase leading-none tracking-[-0.015em] text-u-white shadow-[6px_6px_0_0_#221e1f] transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-u-white hover:text-u-black hover:shadow-[8px_8px_0_0_#221e1f] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none md:px-9 md:py-5"
            >
              Unde ne găsești
            </a>
          </div>
        </div>

        <div
          data-hero="product"
          className="relative order-1 mt-6 lg:order-2 lg:mt-0 lg:-translate-y-12"
        >
          <HeroProductStack />
        </div>
      </div>

      {/* p.10 — the mascot should be recognisable "de peste drum", in any
          posture, at any scale. Here it points straight at the menu. */}
      <Image
        data-hero="mascot"
        src="/brand/m-point.svg"
        alt=""
        width={348}
        height={380}
        priority
        className="u-hidden pointer-events-none absolute bottom-0 right-[-5vw] w-[45vw] max-w-[345px] origin-bottom lg:bottom-[-4px] lg:right-[38%] lg:w-[clamp(210px,15vw,460px)] lg:max-w-none z-100"
      />
    </section>
  );
}
