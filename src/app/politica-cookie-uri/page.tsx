import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Politica de cookie-uri — Utopia Fried Chicken",
  description:
    "Ce cookie-uri folosește site-ul Utopia Fried Chicken și cum le poți gestiona.",
};

export default function PoliticaCookieUriPage() {
  return (
    <LegalPage title="Politica de cookie-uri" updated="13 noiembrie 2026">
      <p>
        Această pagină explică ce sunt cookie-urile, ce tipuri folosim pe
        utopiafriedchicken.ro și cum le poți controla.
      </p>

      <div>
        <h2>1. Ce sunt cookie-urile</h2>
        <p>
          Cookie-urile sunt fișiere text mici, salvate de browser-ul tău
          atunci când vizitezi un site, folosite pentru a reține preferințe
          sau pentru a înțelege modul în care este utilizat site-ul.
        </p>
      </div>

      <div>
        <h2>2. Ce cookie-uri folosim</h2>
        <p>
          <strong>Cookie-uri strict necesare</strong> — asigură funcțiile de
          bază ale Site-ului (de exemplu memorarea faptului că ai închis un
          anunț) și nu pot fi dezactivate.
        </p>
        <p>
          <strong>Cookie-uri de performanță/analiză</strong> — ne ajută să
          înțelegem cum este folosit Site-ul, astfel încât să îl putem
          îmbunătăți. Sunt folosite doar cu acordul tău.
        </p>
        <p>
          <strong>Cookie-uri de marketing</strong> — doar cu acordul tău,
          folosim Meta Pixel și Meta Conversions API (Meta Platforms Ireland
          Ltd.) pentru a măsura eficiența reclamelor noastre pe Facebook și
          Instagram. Acestea setează cookie-urile <code>_fbp</code> și{" "}
          <code>_fbc</code> și transmit către Meta pagina vizitată, adresa IP,
          tipul de browser și acțiuni precum deschiderea hărții sau a paginii
          de comandă Wolt. Alegerea ta este memorată în cookie-ul{" "}
          <code>utopia_consent</code> (strict necesar).
        </p>
      </div>

      <div>
        <h2>3. Cum îți poți gestiona preferințele</h2>
        <p>
          Îți poți schimba oricând acordul pentru cookie-urile de marketing
          din linkul „Setări cookie-uri” din subsolul paginii. De asemenea,
          poți accepta, refuza sau șterge cookie-urile direct din setările
          browser-ului tău. Blocarea anumitor cookie-uri poate afecta
          funcționarea unor părți ale Site-ului.
        </p>
      </div>

      <div>
        <h2>4. Cookie-uri de la terți</h2>
        <p>
          Anumite funcții (de exemplu hărți sau linkuri către rețele
          sociale) pot seta cookie-uri proprii, gestionate de furnizorii
          respectivi conform propriilor politici de confidențialitate.
        </p>
      </div>

      <div>
        <h2>5. Contact</h2>
        <p>
          Pentru întrebări legate de utilizarea cookie-urilor, ne poți scrie
          la{" "}
          <a
            href="mailto:contact@utopiafriedchicken.ro"
            className="text-u-red underline underline-offset-2 hover:text-u-ink"
          >
            contact@utopiafriedchicken.ro
          </a>
          .
        </p>
      </div>
    </LegalPage>
  );
}
