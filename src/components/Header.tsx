import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useStoreProducts } from "@/lib/useStoreProducts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const normalizeText = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();

export function Header() {
  const { categories, products } = useStoreProducts();
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const normalizedQuery = normalizeText(q.trim());
  const matchingCategories = useMemo(
    () => (normalizedQuery ? categories.filter((category) => normalizeText(category.label).includes(normalizedQuery)) : []),
    [categories, normalizedQuery],
  );
  const matchingProducts = useMemo(
    () => normalizedQuery
      ? products.filter((product) => [product.title, product.category, product.categoryName, product.description, ...product.specs]
          .filter((value): value is string => Boolean(value))
          .some((value) => normalizeText(value).includes(normalizedQuery)))
          .slice(0, 4)
      : [],
    [products, normalizedQuery],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-strong border-b">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" aria-label="Perfumería · Inicio" className="shrink-0">
          <img src="/perfumeria-logo.svg" alt="Perfumería" className="h-10 w-32 object-contain object-left sm:h-11" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm">
                Categorías
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="glass-strong">
              {categories.map((c) => (
                <DropdownMenuItem key={c.id} asChild>
                  <Link to={`/catalogo?cat=${c.id}`}>{c.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/catalogo">Catálogo</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/contacto">Contacto</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            asChild
            className="hidden sm:inline-flex bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full"
          >
            <Link to="/catalogo">Ver colección</Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative h-11 w-11">
            <Link to="/carrito" aria-label="Bolsa">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                  {count}
                </span>
              )}
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Abrir menú" className="h-11 w-11">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-strong">
              <DropdownMenuItem asChild>
                <Link to="/catalogo">Catálogo</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/contacto">Contacto</Link>
              </DropdownMenuItem>
              {categories.map((c) => (
                <DropdownMenuItem key={c.id} asChild>
                  <Link to={`/catalogo?cat=${c.id}`}>{c.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <form onSubmit={submit} role="search" className="header-search mx-auto max-w-7xl px-4 pb-3 lg:px-8">
        <div className="header-search-field">
          <button type="submit" aria-label="Buscar productos" className="home-search-icon">
            <Search size={19} strokeWidth={1.8} />
          </button>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar perfumes, cremas..."
            aria-label="Buscar perfumes y productos"
            className="header-search-input"
          />
        </div>
        {normalizedQuery && (
          <div className="header-search-results" role="region" aria-label="Resultados de búsqueda" aria-live="polite">
            {matchingCategories.length > 0 && (
              <div className="header-search-result-group">
                <span>Categorías</span>
                {matchingCategories.map((category) => (
                  <Link key={category.id} to={`/catalogo?cat=${encodeURIComponent(category.id)}`} onClick={() => setQ("")}>
                    {category.label}<span>Ver categoría →</span>
                  </Link>
                ))}
              </div>
            )}
            {matchingProducts.length > 0 && (
              <div className="header-search-result-group">
                <span>Productos</span>
                {matchingProducts.map((product) => (
                  <Link key={product.id} to={`/producto/${product.id}`} onClick={() => setQ("")}>
                    {product.title}<span>{product.categoryName}</span>
                  </Link>
                ))}
              </div>
            )}
            {matchingCategories.length === 0 && matchingProducts.length === 0 && (
              <p className="header-search-no-results">No encontramos coincidencias. Presioná Enter para buscar en el catálogo.</p>
            )}
          </div>
        )}
      </form>
    </header>
  );
}
