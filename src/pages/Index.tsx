import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, formatARS } from "@/lib/products";

const featuredProducts = PRODUCTS.filter((product) => product.category === "perfumes");
const sampleReviews = [
  { name: "Sofía Martínez", quote: "Aromas hermosos y una atención súper cálida.", age: "hace 2 semanas", color: "#c98272" },
  { name: "Lucía Ramírez", quote: "Encontré mi perfume favorito. Volvería a comprar.", age: "hace un mes", color: "#718a78" },
  { name: "Camila Gómez", quote: "Muy buena experiencia y productos preciosos.", age: "hace 3 semanas", color: "#7c83a5" },
  { name: "Valentina Pérez", quote: "Me ayudaron a elegir justo el aroma que buscaba.", age: "hace 5 días", color: "#bd9862" },
];

export default function Index() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const featured = featuredProducts[featuredIndex];

  const showPrevious = () => setFeaturedIndex((index) => (index - 1 + featuredProducts.length) % featuredProducts.length);
  const showNext = () => setFeaturedIndex((index) => (index + 1) % featuredProducts.length);

  useEffect(() => {
    const timer = window.setInterval(showNext, 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="perfume-home mx-auto w-full max-w-6xl px-4 pb-5 sm:px-6 lg:px-8">
      <section className="home-feature" aria-labelledby="featured-title">
        <div className="home-section-heading">
          <div>
            <p className="home-overline">DESCUBRÍ</p>
            <h1 id="featured-title">Perfumes</h1>
          </div>
          <Link to="/catalogo?cat=perfumes" className="home-see-all">
            Ver todos <ArrowRight size={15} />
          </Link>
        </div>
        <article
          className="home-feature-card"
          onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
          onTouchEnd={(event) => {
            if (touchStart === null) return;
            const delta = event.changedTouches[0]?.clientX - touchStart;
            if (delta > 45) showPrevious();
            else if (delta < -45) showNext();
            setTouchStart(null);
          }}
        >
          <div className="home-feature-image">
            <Link to={`/producto/${featured.id}`} aria-label={`Ver ${featured.title}`}>
              <img key={featured.id} src={featured.image} alt={featured.title} fetchPriority={featuredIndex === 0 ? "high" : "auto"} />
            </Link>
            <button type="button" className="home-feature-arrow is-left" onClick={showPrevious} aria-label="Perfume anterior">
              <ChevronLeft size={19} />
            </button>
            <button type="button" className="home-feature-arrow is-right" onClick={showNext} aria-label="Perfume siguiente">
              <ChevronRight size={19} />
            </button>
            <div className="home-feature-dots" aria-label={`Perfume ${featuredIndex + 1} de ${featuredProducts.length}`}>
              {featuredProducts.map((product, index) => (
                <button key={product.id} type="button" aria-label={`Mostrar ${product.title}`} aria-current={index === featuredIndex ? "true" : undefined} onClick={() => setFeaturedIndex(index)} />
              ))}
            </div>
          </div>
          <div className="home-feature-copy" key={`copy-${featured.id}`}>
            <p>SELECCIÓN DE LA CASA · {featuredIndex + 1}/{featuredProducts.length}</p>
            <Link to={`/producto/${featured.id}`}>
              <h2>{featured.title}</h2>
            </Link>
            <span className="home-feature-description">{featured.description}</span>
            <div className="home-feature-buy">
              <strong>{formatARS(featured.price)}</strong>
              <Link to={`/producto/${featured.id}`}>
                Descubrir perfume <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="home-reviews" aria-label="Lo que dicen quienes nos eligen, contenido de muestra">
        <div className="home-review-heading">
          <div>
            <p className="home-overline">LA EXPERIENCIA</p>
            <h2>Palabras que dejan huella</h2>
          </div>
          <span className="home-review-demo-label">Opiniones de muestra</span>
        </div>
        <div className="home-review-window">
          <div className="home-review-track">
            {[false, true].map((duplicate) => (
              <div
                key={duplicate ? "duplicate" : "reviews"}
                className="home-review-group"
                aria-hidden={duplicate || undefined}
              >
                {sampleReviews.map((review) => (
                  <article key={review.name} className="home-review-card">
                    <header>
                      <span className="home-review-avatar" style={{ background: review.color }} aria-hidden="true">
                        {review.name.split(" ").map((part) => part[0]).join("")}
                      </span>
                      <span className="home-review-person">
                        <strong>{review.name}</strong>
                        <small>Cliente verificada · {review.age}</small>
                      </span>
                      <span className="home-review-mark" aria-hidden="true">R</span>
                    </header>
                    <div className="home-review-card-stars" aria-label="5 de 5 estrellas">★★★★★ <span>5.0</span></div>
                    <p>{review.quote}</p>
                    <footer>Fragancias elegidas con cariño</footer>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-categories" aria-labelledby="categories-title">
        <div className="home-section-heading">
          <div>
            <h2 id="categories-title">Categorías</h2>
          </div>
        </div>
        <div className="home-category-list">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={`/catalogo?cat=${category.id}`}
              className="home-category"
            >
              <span>{category.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-browse" aria-labelledby="browse-title">
        <div className="home-section-heading">
          <div>
            <p className="home-overline">UNA SELECCIÓN PARA VOS</p>
            <h2 id="browse-title">Más perfumes</h2>
          </div>
          <Link to="/catalogo" className="home-see-all">
            Ver más <ArrowRight size={15} />
          </Link>
        </div>
        <div className="home-product-carousel store-gallery-track" role="region" aria-label="Deslizá para descubrir más perfumes" tabIndex={0}>
          {PRODUCTS.filter((product) => product.category === "perfumes")
            .slice(1)
            .map((product) => (
              <div key={product.id} className="home-carousel-card">
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
