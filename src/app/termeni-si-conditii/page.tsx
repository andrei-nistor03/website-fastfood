import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Termeni și condiții — Utopia Fried Chicken",
  description:
    "Termenii și condițiile de utilizare a site-ului Utopia Fried Chicken.",
};

export default function TermeniSiConditiiPage() {
  return (
    <LegalPage title="Termeni și condiții" updated="17 august 2026">
      <p>
        Acești termeni și condiții reglementează utilizarea site-ului
        utopiafriedchicken.ro (&bdquo;Site-ul&rdquo;), operat de Utopia Fried
        Chicken (&bdquo;noi&rdquo;, &bdquo;Compania&rdquo;), cu locații în
        Arad și Timișoara. Prin accesarea sau utilizarea Site-ului, ești de
        acord cu acești termeni.
      </p>

      <div>
        <h2>1. Conținutul site-ului</h2>
        <p>
          Meniul, prețurile, imaginile și programul locațiilor afișate pe
          Site au caracter informativ și pot fi modificate fără notificare
          prealabilă. Ne rezervăm dreptul de a corecta orice eroare sau
          inexactitate, inclusiv de preț, imediat ce este descoperită.
        </p>
      </div>

      <div>
        <h2>2. Proprietate intelectuală</h2>
        <p>
          Numele, logo-ul, mascota, identitatea vizuală și toate materialele
          publicate pe Site aparțin Utopia Fried Chicken și sunt protejate de
          legislația privind drepturile de autor și marca înregistrată.
          Reproducerea sau utilizarea acestora fără acord scris prealabil
          este interzisă.
        </p>
      </div>

      <div>
        <h2>3. Utilizare permisă</h2>
        <p>
          Te obligi să folosești Site-ul doar în scopuri legale și să nu
          întreprinzi acțiuni care ar putea afecta funcționarea,
          securitatea sau disponibilitatea acestuia pentru ceilalți
          utilizatori.
        </p>
      </div>

      <div>
        <h2>4. Limitarea răspunderii</h2>
        <p>
          Site-ul este furnizat &bdquo;ca atare&rdquo;. Nu garantăm că
          acesta va fi disponibil neîntrerupt sau lipsit de erori. Nu suntem
          răspunzători pentru eventuale prejudicii rezultate din utilizarea
          sau imposibilitatea utilizării Site-ului.
        </p>
      </div>

      <div>
        <h2>5. Legături către terți</h2>
        <p>
          Site-ul poate conține linkuri către servicii terțe (de exemplu
          Google Maps, rețele sociale sau platforme de livrare). Nu ne
          asumăm răspunderea pentru conținutul sau politicile acestor
          site-uri.
        </p>
      </div>

      <div>
        <h2>6. Modificarea termenilor</h2>
        <p>
          Putem actualiza periodic acești termeni. Versiunea aplicabilă este
          întotdeauna cea publicată pe această pagină, împreună cu data
          ultimei actualizări.
        </p>
      </div>

      <div>
        <h2>7. Contact</h2>
        <p>
          Pentru întrebări legate de acești termeni, ne poți scrie la{" "}
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
