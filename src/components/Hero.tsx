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
      className="relative isolate flex flex-col justify-end overflow-hidden bg-u-red pb-10 pt-16 lg:min-h-svh lg:justify-center lg:pb-16 lg:pt-32"
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

          <div
            data-hero="cta"
            className="u-hidden mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#meniu"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#meniu");
              }}
              className="u-band bg-u-white text-u-black text-[clamp(1.05rem,2.4vw,1.35rem)] transition-transform duration-200 hover:-rotate-2 hover:scale-[1.03]"
            >
              Vezi meniul
            </a>
            <a
              href="#locatii"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#locatii");
              }}
              className="u-band border-[3px] border-u-white bg-transparent text-u-white text-[clamp(1.05rem,2.4vw,1.35rem)] transition-transform duration-200 hover:rotate-2 hover:scale-[1.03]"
            >
              Unde ne găsești
            </a>
          </div>
        </div>

        <div
          data-hero="product"
          className="relative order-1 -translate-y-4 lg:order-2 lg:-translate-y-12"
        >
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
        className="u-hidden pointer-events-none absolute -bottom-1 right-[-5vw] w-[34vw] max-w-[250px] origin-bottom lg:right-[50%] lg:w-[15vw] z-100"
      />
    </section>
  );
}
