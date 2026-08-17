import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Politica de confidențialitate — Utopia Fried Chicken",
  description:
    "Cum colectăm, folosim și protejăm datele tale personale pe utopiafriedchicken.ro.",
};

export default function PoliticaDeConfidentialitatePage() {
  return (
    <LegalPage title="Politica de confidențialitate" updated="17 august 2026">
      <p>
        Utopia Fried Chicken respectă confidențialitatea datelor tale.
        Această politică explică ce date colectăm prin site-ul
        utopiafriedchicken.ro, de ce le colectăm și ce drepturi ai în
        legătură cu ele, conform Regulamentului (UE) 2016/679 (GDPR).
      </p>

      <div>
        <h2>1. Ce date colectăm</h2>
        <p>
          În funcție de modul în care interacționezi cu Site-ul, putem
          colecta: date tehnice (adresă IP, tip de dispozitiv, browser),
          date de utilizare (paginile vizitate, durata vizitei) și, dacă ne
          contactezi direct, numele și adresa de e-mail pe care ni le
          furnizezi.
        </p>
      </div>

      <div>
        <h2>2. Cum folosim datele</h2>
        <p>
          Folosim datele colectate pentru a asigura funcționarea Site-ului,
          a răspunde solicitărilor tale, a înțelege cum este folosit Site-ul
          și a-l îmbunătăți. Nu vindem datele tale personale către terți.
        </p>
      </div>

      <div>
        <h2>3. Temeiul legal</h2>
        <p>
          Prelucrăm date pe baza interesului legitim (funcționarea și
          securitatea Site-ului), a consimțământului (de exemplu pentru
          cookie-uri neesențiale) și, dacă ne contactezi, în vederea
          răspunderii la solicitarea ta.
        </p>
      </div>

      <div>
        <h2>4. Partajarea datelor</h2>
        <p>
          Putem partaja date cu furnizori care ne ajută să operăm Site-ul
          (de exemplu găzduire sau analiză de trafic), strict în măsura
          necesară și sub obligații contractuale de confidențialitate. Nu
          transferăm date către terți în scopuri de marketing fără acordul
          tău.
        </p>
      </div>

      <div>
        <h2>5. Durata păstrării</h2>
        <p>
          Păstrăm datele doar atât timp cât este necesar pentru scopurile
          descrise mai sus sau conform obligațiilor legale aplicabile.
        </p>
      </div>

      <div>
        <h2>6. Drepturile tale</h2>
        <p>
          Ai dreptul de acces, rectificare, ștergere, restricționare a
          prelucrării, portabilitate a datelor și opoziție, precum și
          dreptul de a depune o plângere la Autoritatea Națională de
          Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP).
        </p>
      </div>

      <div>
        <h2>7. Contact</h2>
        <p>
          Pentru orice solicitare legată de datele tale personale, ne poți
          scrie la{" "}
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
