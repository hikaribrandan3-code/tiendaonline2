import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useStoreProducts } from "@/lib/useStoreProducts";
import { ProductCard } from "@/components/ProductCard";

export default function Catalogo() {
  const { products, categories, isDemo } = useStoreProducts();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const sort = params.get("sort") ?? "featured";
  const category = params.get("cat") ?? "";
  const normalize = (value: string) =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  const update = (key: string, value: string) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };
  const filtered = useMemo(
    () =>
      products
        .filter(
          (product) =>
            (!category || product.category === category) &&
            (!query ||
              [
                product.title,
                product.category,
                product.categoryName,
                product.description,
                ...product.specs,
              ]
                .filter(Boolean)
                .some((value) => normalize(value ?? "").includes(normalize(query)))),
        )
        .sort((a, b) =>
          sort === "price-up" ? a.price - b.price : sort === "price-down" ? b.price - a.price : 0,
        ),
    [products, category, query, sort],
  );
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground">
            PERFUMERÍA · FRAGANCIAS Y CUIDADO
          </p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">Todos los productos</h1>
        </div>
      </div>
      <div
        id="categorias"
        className="store-gallery-track my-6 flex gap-2 overflow-x-auto pb-2"
        role="group"
        aria-label="Categorías"
      >
        {[{ id: "", label: "Todo" }, ...categories].map((cat) => (
          <button
            key={cat.id}
            aria-pressed={category === cat.id}
            onClick={() => update("cat", cat.id)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-medium ${category === cat.id ? "bg-black text-white" : "bg-white"}`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-xs text-muted-foreground">
          {filtered.length} productos{isDemo ? " · precios de muestra" : ""}
        </p>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Ordenar
          <select
            aria-label="Ordenar productos"
            value={sort}
            onChange={(event) => update("sort", event.target.value)}
            className="min-h-11 max-w-full rounded-xl border border-black/10 bg-white px-3 text-xs text-black"
          >
            <option value="featured">Destacados</option>
            <option value="price-up">Menor precio</option>
            <option value="price-down">Mayor precio</option>
          </select>
        </label>
      </div>
      {filtered.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-5 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white/70 p-12 text-center">
          <p className="text-sm text-muted-foreground">No hay productos en esta selección todavía.</p>
          <button onClick={() => setParams({})} className="mt-4 text-sm underline">
            Ver toda la colección
          </button>
        </div>
      )}
    </div>
  );
}
