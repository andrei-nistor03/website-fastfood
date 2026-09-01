"use client";

import Image from "next/image";
import { useEffect, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { scrollToSection } from "@/lib/scrollToSection";

const NAV = [
  { href: "#meniu", label: "Meniu" },
  { href: "#locatii", label: "Locații" },
  { href: "#despre", label: "Despre" },
];

export default function Header() {
  const pathname = usePathname();
  // The section ids these links target only exist on the homepage. Off it,
  // they need to be a real navigation back to "/#…" instead of a scroll —
  // scrollToSection's querySelector would just find nothing and no-op.
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSectionClick =
    (href: string, onNavigate?: () => void) => (e: MouseEvent) => {
      if (!isHome) {
        onNavigate?.();
        return;
      }
      e.preventDefault();
      onNavigate?.();
      scrollToSection(href);
    };

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
          href={isHome ? "#top" : "/"}
          onClick={handleSectionClick("#top")}
          className="relative flex shrink-0 items-end gap-0"
          aria-label="Utopia Fried Chicken — începutul paginii"
        >
          <Image
            src="/brand/m-lean.svg"
            alt=""
            width={268}
            height={397}
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
              href={isHome ? n.href : `/${n.href}`}
              onClick={handleSectionClick(n.href)}
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
        aria-hidden={!open}
        inert={!open}
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out md:hidden ${
          open ? "max-h-[320px]" : "max-h-0"
        }`}
      >
        <ul
          className={`flex flex-col gap-3 border-u-black/20 bg-u-red px-5 pb-7 pt-4 transition-[opacity,transform,border-top-width] duration-300 ease-in-out ${
            open
              ? "translate-y-0 border-t-2 opacity-100 delay-100"
              : "-translate-y-2 border-t-0 opacity-0"
          }`}
        >
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={isHome ? n.href : `/${n.href}`}
                onClick={handleSectionClick(n.href, () => setOpen(false))}
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
