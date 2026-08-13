import Image from "next/image";
import Lockup from "./Lockup";
import { locations } from "@/data/locations";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-u-ink pb-10 pt-20 text-u-white md:pb-12 md:pt-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <Lockup
            size="md"
            lines={[
              { text: "We love", tone: "red", tilt: -2 },
              { text: "fried", tone: "yellow", tilt: 3 },
              { text: "chicken!", tone: "white", tilt: -1 },
            ]}
          />

          <div className="grid grid-cols-2 gap-8 md:gap-14">
            <div>
              <p className="u-eyebrow mb-4 text-u-yellow">Pagină</p>
              <ul className="flex flex-col gap-2 text-[0.98rem]">
                <li>
                  <a href="#meniu" className="hover:text-u-yellow">
                    Meniu
                  </a>
                </li>
                <li>
                  <a href="#locatii" className="hover:text-u-yellow">
                    Locații
                  </a>
                </li>
                <li>
                  <a href="#despre" className="hover:text-u-yellow">
                    Despre
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="u-eyebrow mb-4 text-u-yellow">Ne găsești în</p>
              <ul className="flex flex-col gap-2 text-[0.98rem]">
                {locations.map((l) => (
                  <li key={l.city}>
                    <a
                      href={l.maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-u-yellow"
                    >
                      {l.city} — {l.street}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-u-white/15 pt-7 md:flex-row md:items-end md:justify-between">
          {/* p.8 — logo and mascot together, always. */}
          <div className="flex items-end gap-1">
            <Image
              src="/brand/m-heart.webp"
              alt=""
              width={260}
              height={366}
              className="-mb-1 -mr-1 w-[42px]"
            />
            <Image
              src="/brand/logo-light.webp"
              alt="Utopia Fried Chicken"
              width={1000}
              height={279}
              className="w-[170px]"
            />
          </div>

          <p className="text-[0.82rem] leading-[1.5] text-u-white/45">
            © {new Date().getFullYear()} Utopia Fried Chicken. Pui prăjit. Fără
            scuze.
          </p>
        </div>
      </div>
    </footer>
  );
}
