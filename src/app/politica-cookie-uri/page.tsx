import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Politica de cookie-uri — Utopia Fried Chicken",
  description:
    "Ce cookie-uri folosește site-ul Utopia Fried Chicken și cum le poți gestiona.",
};

export default function PoliticaCookieUriPage() {
  return (
    <LegalPage title="Politica de cookie-uri" updated="17 august 2026">
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
      </div>

      <div>
        <h2>3. Cum îți poți gestiona preferințele</h2>
        <p>
          Poți accepta, refuza sau șterge cookie-urile direct din setările
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
