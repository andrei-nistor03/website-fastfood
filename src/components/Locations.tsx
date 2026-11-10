import Image from "next/image";
import Lockup from "./Lockup";
import { locations } from "@/data/locations";

export default function Locations() {
  return (
    <section
      id="locatii"
      data-scroll-align="end"
      className="relative overflow-hidden bg-u-ink py-20 text-u-white md:py-28"
    >
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="u-eyebrow mb-5 text-u-yellow">Locații</p>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Lockup
            as="h2"
            size="lg"
            lines={[
              { text: "Unde", tone: "white", tilt: 2 },
              { text: "ne găsești", tone: "red", tilt: -2.5 },
            ]}
          />
          <p className="max-w-[34ch] text-[1.05rem] text-u-white/65 md:pb-3 md:text-right">
            Două locații. Comanzi la casă sau iei la pachet — dacă e coadă,
            merită așteptarea.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7">
          {locations.map((loc, i) => (
            <div
              key={loc.city}
              data-reveal="card"
              className="u-hidden flex flex-col gap-4"
            >
              <a
                href={loc.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-1 flex-col justify-between overflow-hidden border-[3px] border-u-white/25 bg-u-white/[0.04] p-7 transition-colors duration-300 hover:border-u-yellow md:p-9"
              >
                <span
                  aria-hidden
                  className="u-blob -right-[30%] -top-[45%] h-[130%] w-[130%] opacity-0 transition-opacity duration-500 group-hover:opacity-[0.12]"
                />

                <div className="relative z-10">
                  <h3 className="text-[clamp(2.4rem,6vw,4.251rem)] transition-colors duration-300 group-hover:text-u-yellow">
                    {loc.city}
                  </h3>
                  <p className="u-eyebrow mt-2 text-u-white/45">{loc.county}</p>

                  <dl className="mt-8 flex flex-col gap-4 border-t border-u-white/15 pt-6 text-[0.98rem]">
                    <div>
                      <dt className="u-eyebrow text-[0.62rem] text-u-yellow">
                        Adresă
                      </dt>
                      <dd className="mt-1">
                        {loc.street}, {loc.postcode ? `${loc.postcode} ` : ""}
                        {loc.city}
                      </dd>
                    </div>
                    <div>
                      <dt className="u-eyebrow text-[0.62rem] text-u-yellow">
                        Program
                      </dt>
                      <dd className="mt-1">{loc.hours}</dd>
                    </div>
                    {loc.phone && (
                      <div>
                        <dt className="u-eyebrow text-[0.62rem] text-u-yellow">
                          Telefon
                        </dt>
                        <dd className="mt-1">{loc.phone}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="relative z-10 mt-9 flex items-end justify-between gap-4">
                  <span className="u-band bg-u-yellow text-u-black text-[1.05rem] transition-transform duration-200 group-hover:-rotate-2">
                    Deschide harta
                  </span>
                  <Image
                    src={i === 0 ? "/brand/m-stand.svg" : "/brand/m-sit.svg"}
                    alt=""
                    width={i === 0 ? 248 : 380}
                    height={i === 0 ? 390 : 350}
                    className={`pointer-events-none origin-bottom transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3 ${
                      // m-stand and m-sit have very different aspect ratios
                      // (tall vs. wide) — sizing both off the same width made
                      // the sitting mascot read noticeably smaller, so each
                      // gets its own width tuned to land at roughly the same
                      // rendered height.
                      i === 0
                        ? "w-[84px] md:w-[105px]"
                        : "w-[144px] md:w-[180px]"
                    }`}
                  />
                </div>
              </a>

              {loc.wolt && (
                <a
                  href={loc.wolt}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Comandă pe Wolt — ${loc.city}`}
                  className="flex items-center justify-between gap-4 border-[3px] border-u-white bg-transparent px-7 py-4 font-display text-[clamp(1.1rem,2.6vw,1.55rem)] font-black uppercase leading-none tracking-[-0.015em] text-u-white shadow-[6px_6px_0_0_#221e1f] transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-u-white hover:text-u-black hover:shadow-[8px_8px_0_0_#221e1f] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none md:px-9 md:py-5"
                >
                  <span>
                    Comandă în {loc.city}
                  </span>
                  <Image
                    src="/brand/wolt.png"
                    alt="Wolt"
                    width={288}
                    height={104}
                    className="h-8 w-auto md:h-9"
                  />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
