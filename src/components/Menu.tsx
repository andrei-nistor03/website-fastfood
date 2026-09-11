"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lockup from "./Lockup";
import MenuBucketDrop from "./MenuBucketDrop";
import MenuCrumbBurst, { type MenuCrumbBurstHandle } from "./MenuCrumbBurst";
import { categories } from "@/data/menu";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

// Each card's blob fragment sits in a different corner, cycling by index so
// neighbouring cards never repeat the same placement.
const CARD_BLOB_CORNERS = [
  "-bottom-[52%] -left-[34%]",
  "-right-[38%] -top-[48%]",
  "-bottom-[56%] -right-[30%]",
];

export default function Menu() {
  const [active, setActive] = useState(categories[0].id);
  const grid = useRef<HTMLDivElement>(null);
  const tablist = useRef<HTMLDivElement>(null);
  const headerRow = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const crumbBurst = useRef<MenuCrumbBurstHandle>(null);
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

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    if (prefersReducedMotion()) {
      return () => cancelAnimationFrame(raf);
    }

    const cards = grid.current.querySelectorAll("[data-card]");
    const tabs = tablist.current?.querySelectorAll("[role='tab']");
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
      // Clear any inline transform GSAP left on the tabs from a previous
      // selection so a deselected tab drops back to its class-defined
      // (unrotated) resting state instead of staying stuck at -2deg.
      if (tabs?.length) {
        gsap.set(tabs, { clearProps: "transform" });
      }
      // The same band recipe as the entrance timeline — the newly active
      // tab gets struck into place rather than just swapping colour.
      if (activeTab) {
        gsap.fromTo(
          activeTab,
          { scale: 0.82, rotation: -9 },
          {
            scale: 1,
            rotation: -2,
            duration: 0.4,
            ease: "back.out(2.4)",
            onComplete: () => gsap.set(activeTab, { clearProps: "transform" }),
          },
        );
      }
    }, grid);
    return () => {
      ctx.revert();
      cancelAnimationFrame(raf);
    };
  }, [active]);

  return (
    <section
      ref={sectionRef}
      id="meniu"
      className="u-checker relative overflow-hidden py-10 md:py-12"
      style={
        {
          // Low-contrast pass on the brand checkerboard: the same motif, but
          // ink against a close charcoal grey at a larger scale, so it reads
          // as ambient dark texture behind the grid instead of competing
          // with the products.
          "--checker-a": "var(--color-u-ink)",
          "--checker-b": "color-mix(in srgb, var(--color-u-ink) 82%, var(--color-u-white))",
          "--checker-size": "280px",
        } as CSSProperties
      }
      aria-labelledby="meniu-titlu"
    >
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 md:px-10">
        <MenuCrumbBurst ref={crumbBurst} className="z-[15]" />
        <div className="border-[3px] border-u-ink bg-u-cream px-5 py-7 md:px-9 md:py-9">
          <p className="u-eyebrow mb-5 text-u-red">Meniul</p>

          <div
            ref={headerRow}
            className="relative flex flex-col gap-8 md:flex-row md:items-start md:justify-between"
          >
            <Lockup
              as="h2"
              size="md"
              align="items-center md:items-start"
              lines={[
                { text: "Real", tone: "yellow", tilt: -2 },
                { text: "Fried", tone: "red", tilt: 3 },
                { text: "Chicken", tone: "black", tilt: -3 },
              ]}
            />
            <MenuBucketDrop pinTargetRef={sectionRef} />
          </div>

          {/* Tabs, built from the same band recipe as everything else. */}
          <div
            ref={tablist}
            role="tablist"
            aria-label="Categorii din meniu"
            className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-b-[3px] border-u-ink/15 pb-5 md:mt-16 lg:justify-start"
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
                  onClick={(e) => {
                    if (c.id !== active) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      crumbBurst.current?.burst(
                        rect.left + rect.width / 2,
                        rect.top + rect.height / 2,
                      );
                    }
                    setActive(c.id);
                  }}
                  className={
                    on
                      ? "u-band bg-u-red text-u-white text-[clamp(1.05rem,2.2vw,1.35rem)] -rotate-2"
                      : "u-band border-[3px] border-u-ink/70 bg-transparent text-[clamp(1.05rem,2.2vw,1.35rem)] text-u-ink transition-[color,transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:-rotate-1 hover:border-u-ink hover:bg-u-ink hover:text-u-cream cursor-pointer"
                  }
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {current.notes && current.notes.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {current.notes.map((note) => (
                <p
                  key={note}
                  className="u-eyebrow inline-block bg-u-ink px-3 py-1.5 text-u-yellow"
                >
                  {note}
                </p>
              ))}
            </div>
          )}
        </div>

        <div
          ref={grid}
          role="tabpanel"
          id={`panou-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="mt-10 flex flex-col gap-10"
        >
          {current.groups.map((group, gi) => (
            <div key={group.title ?? `group-${gi}`}>
              {group.title && (
                <h3 className="u-eyebrow mb-4 inline-block -rotate-1 bg-u-yellow px-3 py-1.5 text-u-black">
                  {group.title}
                </h3>
              )}
              <ul className="flex flex-wrap gap-4 md:gap-6 lg:grid lg:grid-cols-4">
                {group.items.map((item, i) => {
                  const imageSrc =
                    item.image === null
                      ? null
                      : `/produse/${item.image ?? item.slug}.webp`;
                  return (
                    <li
                      key={item.slug}
                      data-card
                      data-reveal="card"
                      className="u-hidden group relative flex basis-[calc(50%-0.5rem)] shrink-0 grow-0 flex-col overflow-hidden border-[3px] border-u-ink bg-u-red transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 md:basis-[calc(33.333%-1rem)] lg:basis-auto"
                    >
                      {imageSrc ? (
                        <div className="relative flex aspect-square items-center justify-center overflow-hidden p-3">
                          {/* A blob fragment per card — colour and rhythm in a
                              composition that would otherwise be too calm (p.15). */}
                          <span
                            aria-hidden
                            className={`u-blob h-[92%] w-[92%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 ${CARD_BLOB_CORNERS[i % 3]}`}
                          />
                          <Image
                            src={imageSrc}
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
                      ) : (
                        // Label-only card — no photography for this item, so
                        // skip the image slot instead of showing a blank one.
                        <span
                          aria-hidden
                          className={`u-blob absolute h-[92%] w-[92%] ${CARD_BLOB_CORNERS[i % 3]}`}
                        />
                      )}

                      <div
                        className={
                          imageSrc
                            ? "flex flex-1 flex-col gap-1.5 border-t-[3px] border-u-ink px-4 py-4"
                            : "relative flex min-h-[128px] flex-1 flex-col items-center justify-center gap-1.5 px-4 py-6 text-center"
                        }
                      >
                        <h3 className="text-[clamp(1.05rem,2vw,1.35rem)] leading-[0.95] text-u-white">
                          {item.name}
                        </h3>
                        {item.desc && (
                          <p className="text-[0.86rem] leading-[1.4] text-u-white/80">
                            {item.desc}
                          </p>
                        )}
                        {item.price && (
                          <p
                            className={
                              imageSrc
                                ? "mt-auto pt-2 font-bold text-u-yellow"
                                : "pt-1 font-bold text-u-yellow"
                            }
                          >
                            {item.price}
                          </p>
                        )}
                        {!imageSrc && item.tag && (
                          <span className="u-eyebrow -rotate-2 bg-u-yellow px-2.5 py-1 text-[0.62rem] text-u-black">
                            {item.tag}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
