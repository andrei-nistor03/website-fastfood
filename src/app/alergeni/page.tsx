import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import RecipeSection from "@/components/RecipeSection";
import { ALLERGEN_NAMES } from "@/data/allergens";
import {
  crispyCategory,
  wingsCategory,
  famousWingsCategory,
  burgersCategory,
  dealsCategory,
  comboCategory,
  oneBiteCategory,
  bucketsCategory,
  sidesCategory,
  sosuriCategory,
  racoritoareCategory,
  informatiiImportante,
  calculNutritional,
  componenteNutritionale,
} from "@/data/allergen-recipes";

export const metadata: Metadata = {
  title: "Alergeni — Utopia Fried Chicken",
  description:
    "Ingredientele, gramajele și alergenii prezenți în preparatele Utopia Fried Chicken, conform Regulamentului (UE) nr. 1169/2011 și Legii nr. 321/2023.",
};

export default function AlergeniPage() {
  return (
    <LegalPage title="Alergeni" updated="17 octombrie 2026">
      <p>
        Acest document informează clienții Utopia Fried Chicken (operator:{" "}
        <strong>Utopia Burger SRL</strong>, Carol Davila 51, 300262
        Timișoara), cu locații în parcarea Utopia din Timișoara (Str.
        Circumvalațiunii nr. 35) și în Arad (Bd. Revoluției nr. 35), cu
        privire la ingredientele, gramajele și alergenii prezenți în
        preparatele servite, conform Regulamentului (UE) nr. 1169/2011
        privind informarea consumatorilor cu privire la produsele
        alimentare și Legii nr. 321/2023 privind informarea consumatorilor
        în sectorul HoReCa din România. Conținutul reproduce documentul
        oficial al operatorului, <strong>„Informații despre ingrediente,
        alergeni și gramaje produse”</strong>, valabil din 17.10.2026.
      </p>
      <p className="text-[0.9rem] italic text-u-ink/60">
        Informațiile despre ingrediente și alergeni provin direct de pe
        etichetele furnizorilor sau din rețeta preparatului. Fiecare produs
        de mai jos se poate extinde pentru a vedea tabelul complet de
        rețetă și declarația nutrițională estimată (vezi secțiunea 15
        pentru modul de calcul).
      </p>

      <div>
        <h2>1. Bază legală și scop</h2>
        <p>
          Regulamentul UE 1169/2011 (aplicabil direct în România) și Legea
          321/2023 (pentru sectorul HoReCa) ne obligă să punem la dispoziția
          clienților, înainte de efectuarea comenzii, informații privind
          substanțele sau produsele care cauzează alergii sau intoleranțe,
          prezente în preparatele servite, precum și țara de origine a
          cărnii și mențiunea produselor congelate anterior. Am ales
          varianta documentului scris, disponibil pe site și la cerere în
          locații.
        </p>
      </div>

      <div>
        <h2>2. Legenda celor 14 alergeni majori</h2>
        <p>
          Conform Regulamentului (UE) nr. 1169/2011, Anexa II. Codurile de
          mai jos corespund badge-urilor colorate din tabelele de produse
          (roșu = alergen confirmat, galben = poate apărea sub formă de
          urme) — pe desktop, treci cu mouse-ul peste un cod pentru numele
          alergenului.
        </p>
        <ol className="mt-2 grid list-decimal grid-cols-1 gap-1 pl-5 sm:grid-cols-2">
          {Object.entries(ALLERGEN_NAMES).map(([code, name]) => (
            <li key={code}>{name}</li>
          ))}
        </ol>
      </div>

      <div>
        <h2>3. Crispy uri</h2>
        <RecipeSection category={crispyCategory} />
      </div>

      <div>
        <h2>4. Wingsuri</h2>
        <RecipeSection category={wingsCategory} />
      </div>

      <div>
        <h2>5. Famous Wings</h2>
        <RecipeSection category={famousWingsCategory} />
      </div>

      <div>
        <h2>6. Burgers</h2>
        <RecipeSection category={burgersCategory} />
      </div>

      <div>
        <h2>7. Deals</h2>
        <p className="text-[0.9rem] text-u-ink/65">
          Meniurile compuse de mai jos combină produsele de bază din
          secțiunile 3-6; alergenii afișați reprezintă suma alergenilor
          tuturor componentelor.
        </p>
        <div className="mt-2">
          <RecipeSection category={dealsCategory} />
        </div>
      </div>

      <div>
        <h2>8. Combo</h2>
        <RecipeSection category={comboCategory} />
      </div>

      <div>
        <h2>9. One Bite First Time</h2>
        <RecipeSection category={oneBiteCategory} />
      </div>

      <div>
        <h2>10. Buckets</h2>
        <RecipeSection category={bucketsCategory} />
      </div>

      <div>
        <h2>11. Sides</h2>
        <RecipeSection category={sidesCategory} />
      </div>

      <div>
        <h2>12. Sosuri</h2>
        <RecipeSection category={sosuriCategory} />
      </div>

      <div>
        <h2>13. Răcoritoare</h2>
        <RecipeSection category={racoritoareCategory} />
      </div>

      <div>
        <h2>14. Informații importante</h2>
        <dl className="flex flex-col gap-3">
          {informatiiImportante.map((item) => (
            <div key={item.title}>
              <dt className="font-bold text-u-ink">{item.title}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h2>15. Cum este calculată declarația nutrițională</h2>
        <dl className="flex flex-col gap-3">
          {calculNutritional.map((item) => (
            <div key={item.title}>
              <dt className="font-bold text-u-ink">{item.title}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[0.8rem]">
            <thead>
              <tr className="text-u-ink/50">
                <th className="px-2 py-1.5 font-normal">Componenta (la 100 g)</th>
                <th className="px-2 py-1.5 font-normal">Energie</th>
                <th className="px-2 py-1.5 font-normal">Grăsimi</th>
                <th className="px-2 py-1.5 font-normal">din care saturate</th>
                <th className="px-2 py-1.5 font-normal">Glucide</th>
                <th className="px-2 py-1.5 font-normal">din care zaharuri</th>
                <th className="px-2 py-1.5 font-normal">Proteine</th>
                <th className="px-2 py-1.5 font-normal">Sare</th>
                <th className="px-2 py-1.5 font-normal">Sursa valorii</th>
              </tr>
            </thead>
            <tbody>
              {componenteNutritionale.map((c) => (
                <tr key={c.name} className="border-t border-u-ink/10 align-top text-u-ink/75">
                  <td className="px-2 py-1.5 font-semibold text-u-ink">{c.name}</td>
                  <td className="whitespace-nowrap px-2 py-1.5">{c.energy}</td>
                  <td className="whitespace-nowrap px-2 py-1.5">{c.fat}</td>
                  <td className="whitespace-nowrap px-2 py-1.5">{c.saturated}</td>
                  <td className="whitespace-nowrap px-2 py-1.5">{c.carbs}</td>
                  <td className="whitespace-nowrap px-2 py-1.5">{c.sugars}</td>
                  <td className="whitespace-nowrap px-2 py-1.5">{c.protein}</td>
                  <td className="whitespace-nowrap px-2 py-1.5">{c.salt}</td>
                  <td className={"px-2 py-1.5 " + (c.reference ? "italic text-u-red/70" : "")}>
                    {c.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2>16. Notă legală</h2>
        <p>
          Acest document este un instrument de lucru întocmit pe baza
          informațiilor disponibile la data de mai jos și nu constituie
          consultanță juridică. Declarațiile nutriționale sunt estimate prin
          calcul (vezi secțiunea 15), nu măsurate în laborator.
          Responsabilitatea finală pentru acuratețea informațiilor afișate
          către clienți revine operatorului economic (Utopia Burger SRL).
          Pentru orice alergie sau intoleranță, te rugăm să confirmi cu
          personalul înainte de a comanda.
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
          Data întocmirii: 17 octombrie 2026. Valabil din: 17.10.2026.
        </p>
      </div>
    </LegalPage>
  );
}
