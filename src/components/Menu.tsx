"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import Lockup from "./Lockup";
import { categories } from "@/data/menu";

export default function Menu() {
  const [active, setActive] = useState(categories[0].id);
  const grid = useRef<HTMLUListElement>(null);
  const tablist = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const current = categories.find((c) => c.id === active) ?? categories[0];

  useEffect(() => {
    if (!grid.current) return;
    // The opening pass is handled by the scroll timeline in Motion.tsx so the
    // grid does not animate before anyone has scrolled to it.
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = grid.current.querySelectorAll("[data-card]");
    const activeTab = tablist.current?.querySelector('[aria-selected="true"]');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 26, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
          stagger: { each: 0.026, from: "start" },
          overwrite: true,
        },
      );
      // The same band recipe as the entrance timeline — the newly active
      // tab gets struck into place rather than just swapping colour.
      if (activeTab) {
        gsap.fromTo(
          activeTab,
          { scale: 0.82, rotation: -9 },
          { scale: 1, rotation: -2, duration: 0.4, ease: "back.out(2.4)" },
        );
      }
    }, grid);
    return () => ctx.revert();
  }, [active]);

  return (
    <section
      id="meniu"
      className="u-checker relative overflow-hidden py-20 md:py-28"
      style={
        {
          "--checker-a": "var(--color-u-ink)",
          "--checker-b": "var(--color-u-white)",
          "--checker-size": "48px",
        } as CSSProperties
      }
      aria-labelledby="meniu-titlu"
    >
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 md:px-10">
        {/* A solid panel for the header content to sit on — the checkerboard
            is the section's floor, not something running text has to fight
            for legibility against. */}
        <div className="border-[3px] border-u-ink bg-u-cream px-5 py-7 md:px-9 md:py-9">
          <p className="u-eyebrow mb-5 text-u-red">Meniul</p>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <Lockup
              as="h2"
              size="lg"
              lines={[
                { text: "Cool people", tone: "yellow", tilt: -2 },
                { text: "eat", tone: "red", tilt: 3 },
                { text: "Fried chicken", tone: "black", tilt: -1 },
              ]}
            />
            <div className="flex items-end gap-5 md:pb-2">
              <Image
                src="/brand/m-heart.webp"
                alt=""
                width={260}
                height={366}
                className="hidden w-[86px] shrink-0 md:block lg:w-[104px]"
              />
              <p
                id="meniu-titlu"
                className="max-w-[34ch] text-[1.05rem] text-u-ink/80 md:text-right"
              >
                Tot ce se poate comanda. Dacă e în meniu, îl susținem.
              </p>
            </div>
          </div>

          {/* Tabs, built from the same band recipe as everything else. */}
          <div
            ref={tablist}
            role="tablist"
            aria-label="Categorii din meniu"
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-b-[3px] border-u-ink/15 pb-5"
          >
            {categories.map((c) => {
              const on = c.id === active;
              return (
                <button
                  key={c.id}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls={`panou-${c.id}`}
                  id={`tab-${c.id}`}
                  onClick={() => setActive(c.id)}
                  className={
                    on
                      ? "u-band bg-u-red text-u-white text-[clamp(1.05rem,2.2vw,1.35rem)] -rotate-2"
                      : "u-band bg-transparent text-[clamp(1.05rem,2.2vw,1.35rem)] text-u-ink/45 transition-[color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:text-u-ink"
                  }
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {current.note && (
            <p className="u-eyebrow mt-6 inline-block bg-u-ink px-3 py-1.5 text-u-yellow">
              {current.note}
            </p>
          )}
        </div>

        <ul
          ref={grid}
          role="tabpanel"
          id={`panou-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
        >
          {current.items.map((item, i) => (
            <li
              key={item.slug}
              data-card
              data-reveal="card"
              className="u-hidden group relative flex flex-col overflow-hidden border-[3px] border-u-ink bg-u-red transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5"
            >
              <div className="relative flex aspect-square items-center justify-center overflow-hidden p-3">
                {/* A blob fragment per card — colour and rhythm in a
                    composition that would otherwise be too calm (p.15). */}
                <span
                  aria-hidden
                  className={`u-blob h-[92%] w-[92%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 ${
                    i % 3 === 0
                      ? "-bottom-[52%] -left-[34%]"
                      : i % 3 === 1
                        ? "-right-[38%] -top-[48%]"
                        : "-bottom-[56%] -right-[30%]"
                  }`}
                />
                <Image
                  src={`/produse/${item.slug}.webp`}
                  alt={item.name}
                  width={520}
                  height={520}
                  sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                  className="relative z-[1] h-full w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] group-hover:-rotate-2"
                />
                {item.tag && (
                  <span className="u-eyebrow absolute left-0 top-3 z-[2] -rotate-2 bg-u-yellow px-2.5 py-1 text-[0.62rem] text-u-black">
                    {item.tag}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1.5 border-t-[3px] border-u-ink px-4 py-4">
                <h3 className="text-[clamp(1.05rem,2vw,1.35rem)] leading-[0.95] text-u-white">
                  {item.name}
                </h3>
                <p className="text-[0.86rem] leading-[1.4] text-u-white/80">
                  {item.desc}
                </p>
                {item.price && (
                  <p className="mt-auto pt-2 font-bold text-u-yellow">
                    {item.price}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
