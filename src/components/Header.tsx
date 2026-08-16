"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { scrollToSection } from "@/lib/scrollToSection";

const NAV = [
  { href: "#meniu", label: "Meniu" },
  { href: "#locatii", label: "Locații" },
  { href: "#despre", label: "Despre" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-u-red transition-shadow duration-300 ${
        scrolled ? "shadow-[0_2px_0_0_rgba(0,0,0,0.35)]" : ""
      }`}
    >
    
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-3 md:px-10 md:py-4">
        {/* p.8 — the mascot is the one element allowed to invade the logo's
            clear space, and the two should appear together wherever possible. */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("#top");
          }}
          className="relative flex shrink-0 items-end gap-0"
          aria-label="Utopia Fried Chicken — începutul paginii"
        >
          <Image
            src="/brand/m-lean.webp"
            alt=""
            width={120}
            height={190}
            priority
            className="-mb-3 w-[34px] md:w-[42px]"
          />
          <Image
            src="/brand/logo-light.webp"
            alt="Utopia Fried Chicken"
            width={1000}
            height={279}
            priority
            className="-ml-1 w-[122px] md:w-[150px]"
          />
        </a>

        <nav className="hidden items-center gap-4 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(n.href);
              }}
              className="u-band bg-u-yellow text-u-black text-[0.95rem] transition-transform duration-200 hover:-rotate-2"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="nav-mobil"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span className="sr-only">{open ? "Închide meniul" : "Deschide meniul"}</span>
          <span
            className={`block h-[3px] w-6 bg-u-white transition-transform duration-200 ${
              open ? "translate-y-[8px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[3px] w-6 bg-u-white transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[3px] w-6 bg-u-white transition-transform duration-200 ${
              open ? "-translate-y-[8px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        id="nav-mobil"
        hidden={!open}
        className="border-t-2 border-u-black/20 bg-u-red px-5 pb-7 pt-4 md:hidden"
      >
        <ul className="flex flex-col gap-3">
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  scrollToSection(n.href);
                }}
                className="u-band bg-u-yellow text-u-black text-[1.62rem]"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
