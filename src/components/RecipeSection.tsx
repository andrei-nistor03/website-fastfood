import type { ProductCategory } from "@/data/allergen-recipes";
import RecipeCard from "./RecipeCard";

/** Renders one PDF category (Crispy uri, Burgers, Deals, …) as a list of
 * collapsible RecipeCards. Used as the body of a numbered <h2> section on
 * the Alergeni page. */
export default function RecipeSection({ category }: { category: ProductCategory }) {
  return (
    <div className="flex flex-col gap-2">
      {category.intro ? (
        <p className="text-[0.9rem] text-u-ink/65">{category.intro}</p>
      ) : null}
      {category.products.map((product) => (
        <RecipeCard key={product.name} product={product} />
      ))}
    </div>
  );
}
