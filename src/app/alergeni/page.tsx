import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import AllergenTable from "@/components/AllergenTable";
import {
  ALLERGEN_NAMES,
  crispyWingsAllergens,
  burgeriAllergens,
  sosuriAllergens,
  sidesAllergens,
} from "@/data/allergens";

export const metadata: Metadata = {
  title: "Alergeni — Utopia Fried Chicken",
  description:
    "Alergenii prezenți în preparatele Utopia Fried Chicken, conform Regulamentului (UE) nr. 1169/2011 și Legii nr. 321/2023.",
};

/** A boxed callout for the two Legea 321/2023 requirements we haven't
 * finished collecting yet (Section 5.1) — kept visually distinct so it
 * can't be mistaken for a confirmed fact. */
function NotaIncompleta({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 rounded-md border border-u-red/30 bg-u-red/5 p-4 font-bold text-u-red">
      {children}
    </p>
  );
}

export default function AlergeniPage() {
  return (
    <LegalPage title="Alergeni" updated="11 septembrie 2026">
      <p>
        Acest document informează clienții Utopia Fried Chicken (operator:{" "}
        <strong>Utopia Burger SRL</strong>, Carol Davila 51, 300262
        Timișoara), cu locații în Timișoara (Calea Circumvalațiunii 35, în
        parcarea Utopia) și Arad (Bulevardul Revoluției 35), cu privire la
        alergenii prezenți în preparatele servite, conform Regulamentului
        (UE) nr. 1169/2011 privind informarea consumatorilor cu privire la
        produsele alimentare și Legii nr. 321/2023 privind informarea
        consumatorilor în sectorul HoReCa din România.
      </p>

      <div>
        <h2>1. Bază legală și scop</h2>
        <p>
          Regulamentul UE 1169/2011 (aplicabil direct în România) și Legea
          321/2023 (pentru sectorul HoReCa) ne obligă să punem la dispoziția
          clienților, înainte de efectuarea comenzii, informații privind
          substanțele sau produsele care cauzează alergii sau intoleranțe,
          prezente în preparatele servite. Am ales varianta documentului
          scris, disponibil pe site și la cerere în locații.
        </p>
        <p>
          Legea 321/2023 impune, pe lângă alergeni, și: informații
          nutriționale minime (valoare energetică, grăsimi, carbohidrați,
          proteine), țara de origine a cărnii (vită, porc, oaie, capră,
          pasăre) și menționarea produselor congelate anterior. Secțiunile 5
          și 6 tratează aceste cerințe suplimentare și stadiul lor actual de
          completare.
        </p>
      </div>

      <div>
        <h2>2. Legenda celor 14 alergeni majori</h2>
        <p>Conform Regulamentului (UE) nr. 1169/2011, Anexa II:</p>
        <ol className="mt-2 grid list-decimal grid-cols-1 gap-1 pl-5 sm:grid-cols-2">
          {Object.entries(ALLERGEN_NAMES).map(([code, name]) => (
            <li key={code}>{name}</li>
          ))}
        </ol>
      </div>

      <div>
        <h2>3. Meniu — alergeni pe produs</h2>
        <p>
          Coloana <strong>„Alergeni certi”</strong> conține alergenii
          confirmați fie prin eticheta reală a furnizorului (pesmet, cele
          două marinade), fie prin compoziția de bază a rețetei (ex:
          maioneza conține întotdeauna ou). Coloana{" "}
          <strong>„Alergeni posibili*”</strong> conține alergeni care pot
          apărea în funcție de rețeta exactă a furnizorului (ex: lecitină de
          soia în unele maioneze sau chifle) și care sunt în curs de
          confirmare cu etichetele reale ale tuturor produselor cumpărate —
          vezi Secțiunea 7. Codurile corespund legendei din Secțiunea 2 (pe
          desktop, treci cu mouse-ul peste un cod pentru numele
          alergenului).
        </p>

        <h3 className="mt-5 text-[1rem] text-u-ink/70">
          3.1 Crispy, Wings și Famous Wings
        </h3>
        <AllergenTable rows={crispyWingsAllergens} />

        <h3 className="mt-5 text-[1rem] text-u-ink/70">
          3.2 Burgeri <span className="font-normal">(chiflă + 2× crispy strips + sos + brânză)</span>
        </h3>
        <AllergenTable rows={burgeriAllergens} />

        <h3 className="mt-5 text-[1rem] text-u-ink/70">
          3.3 Sosuri <span className="font-normal">(porție separată / dip)</span>
        </h3>
        <AllergenTable rows={sosuriAllergens} />

        <h3 className="mt-5 text-[1rem] text-u-ink/70">
          3.4 Cartofi și sides
        </h3>
        <AllergenTable rows={sidesAllergens} />

        <p className="mt-3 text-[0.85rem] italic text-u-ink/55">
          * = alergen posibil, neconfirmat încă pe eticheta reală a
          furnizorului — vezi Secțiunea 7.
        </p>
      </div>

      <div>
        <h2>4. Meniuri compuse: Deals, Combo, Buckets</h2>
        <p>
          Deals, Combo și Buckets sunt combinații ale produselor de bază din
          Secțiunea 3. Alergenii unui meniu compus reprezintă reuniunea
          (suma) alergenilor tuturor componentelor sale. Exemplu: „Perfect
          Deal” (1 burger la alegere + 2 crispy strips + cartofi medii +
          suc) conține alergenii burgerului ales (vezi tabelul 3.2) plus
          alergenii Crispy Strips (1, 3, 7; posibil 6).
        </p>
        <p>
          Pentru orice meniu care nu apare explicit mai sus, alergenii se
          calculează prin însumarea codurilor componentelor sale, pentru a
          evita erorile de calcul manual — dacă ai nelămuriri, întreabă
          personalul înainte de a comanda.
        </p>
      </div>

      <div>
        <h2>5. Informații suplimentare obligatorii (Legea 321/2023)</h2>
        <h3 className="mt-5 text-[1rem] text-u-ink/70">
          5.1 Țara de origine a cărnii de pasăre
        </h3>
        <NotaIncompleta>
          NECOMPLETAT — Legea 321/2023 cere menționarea țării de origine
          pentru carnea de vită, porc, oaie, capră și pasăre. Această
          informație urmează să fie obținută de la furnizorul de carne și
          adăugată aici.
        </NotaIncompleta>

        <h3 className="mt-5 text-[1rem] text-u-ink/70">
          5.2 Produse congelate anterior
        </h3>
        <p>
          Cartofii (fries) sunt congelați — acest lucru este deja reflectat
          în denumirea produsului pe meniu („cartofi congelați”). Pentru
          carnea de pui (crispy strips, wings), statusul de proaspăt/congelat
          anterior nu a fost încă confirmat și va fi clarificat cu
          furnizorul.
        </p>
      </div>

      <div>
        <h2>6. Informații nutriționale</h2>
        <NotaIncompleta>
          NEINCLUSE în acest document. Legea 321/2023 cere minimum valoarea
          energetică (kcal), grăsimi, carbohidrați și proteine per
          produs/porție. Nu am afișat cifre estimative pentru a evita
          informații nutriționale incorecte către clienți — secțiunea va fi
          completată pe baza rețetelor exacte sau a unei analize de
          laborator.
        </NotaIncompleta>
      </div>

      <div>
        <h2>7. Sursa datelor și stadiul de confirmare</h2>
        <p>
          <strong>Etichetă reală confirmată</strong> (cel mai sigur nivel):
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>Pesmet (pentru pui și pește) — fabricat în Polonia</li>
          <li>Marinadă Delicată (nepicantă, pentru pui) — fabricată în Polonia</li>
          <li>Marinadă Picantă (pentru pui) — fabricată în Polonia</li>
        </ul>
        <p className="mt-3">
          <strong>Confirmat verbal de operator</strong>, dar nu de pe
          etichetă:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>Ulei de prăjit: vegetal mixt / palmier (nu ulei de arahide)</li>
          <li>Chiflă burger: fără semințe de susan</li>
          <li>Cartofi congelați: doar cartof tăiat, fără înveliș/coating</li>
        </ul>
        <p className="mt-3 text-[0.92rem] italic text-u-ink/70">
          Compoziție generică, cercetată (nu eticheta furnizorului real):
          maioneză, ketchup, muștar, sos barbecue, sos Franks RedHot, sos
          Worcestershire, cheddar felii, sos cheddar concentrat, parmezan,
          iaurt grecesc, oțet, dulceață de vișine, cremă de trufe, ceapă
          crocantă, castraveți murați, salată iceberg, varză, morcov,
          băuturi carbogazoase. Aceste rânduri sunt marcate cu * în
          tabelele din Secțiunea 3 și necesită confirmare cu eticheta reală
          înainte ca acest document să poată fi considerat complet conform.
        </p>
      </div>

      <div>
        <h2>8. Notă legală</h2>
        <p>
          Acest document este un instrument de lucru întocmit pe baza
          informațiilor disponibile la data de mai jos și nu constituie
          consultanță juridică. Secțiunile 5, 6 și elementele marcate cu * în
          Secțiunea 3 sunt în curs de completare/confirmare. Responsabilitatea
          finală pentru acuratețea informațiilor afișate către clienți
          revine operatorului economic (Utopia Burger SRL). Pentru orice
          alergie sau intoleranță, te rugăm să confirmi cu personalul înainte
          de a comanda.
        </p>
        <p>
          Pentru întrebări legate de acest document, ne poți scrie la{" "}
          <a
            href="mailto:contact@utopiafriedchicken.ro"
            className="text-u-red underline underline-offset-2 hover:text-u-ink"
          >
            contact@utopiafriedchicken.ro
          </a>
          .
        </p>
        <p className="text-[0.85rem] italic text-u-ink/55">
          Data întocmirii: 11 septembrie 2026
        </p>
      </div>
    </LegalPage>
  );
}
