import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { formatARS, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product; index?: number; images?: string[] }) {
  const navigate = useNavigate();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [added]);
  return (
    <article className="perfume-product-card min-w-0">
      <div className="perfume-product-art relative">
        <Link
          to={`/producto/${product.id}`}
          className="group block aspect-square overflow-hidden rounded-[1.2rem] bg-[#f1f0f4]"
        >
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            width="960"
            height="1200"
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          aria-label={`${product.has_sizes ? "Choose an option for" : "Add to cart:"} ${product.title}`}
          onClick={() => {
            if (product.has_sizes) {
              navigate(`/producto/${product.id}`);
              return;
            }
            add(product);
            setAdded(true);
            toast.success("Added to cart", { description: product.title });
          }}
          className="perfume-add-button absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full text-white shadow-sm transition hover:scale-105 active:scale-95"
        >
          {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="px-1 pb-3 pt-2.5">
        <p className="text-[10px] tracking-wide text-muted-foreground">
          {product.categoryName ?? product.brand}
        </p>
        <Link
          to={`/producto/${product.id}`}
          className="mt-1 block min-h-[2.5em] break-words text-[13px] font-medium leading-snug"
        >
          {product.title}
        </Link>
        <p className="mt-1.5 text-sm font-semibold">{formatARS(product.price)}</p>
      </div>
    </article>
  );
}
