export type Category = string;
export const CATEGORIES = [
  { id: "perfumes", label: "Perfumes", description: "Encontrá tu próximo aroma" },
  { id: "cremas", label: "Cremas", description: "Cuidado simple para todos los días" },
  { id: "lociones", label: "Lociones", description: "Texturas livianas y frescas" },
  { id: "maquillaje", label: "Maquillaje", description: "Esenciales para tu rutina" },
];
export type Product = {
  id: string;
  title: string;
  brand: string;
  category: Category;
  price: number;
  image: string;
  specs: string[];
  description: string;
  categoryName?: string;
  allImages?: string[];
  demo?: boolean;
  has_sizes?: boolean;
  sizes?: Record<string, boolean>;
  selectedSize?: string;
};

const demo = (
  id: string,
  title: string,
  category: string,
  price: number,
  image: string,
  description: string,
  specs: string[],
): Product => ({
  id: `demo-${id}`,
  title,
  category,
  price,
  image: `/images/perfumeria/${image}`,
  brand: "Perfumería",
  specs: [...specs, "Precio ilustrativo para la demo"],
  description,
  categoryName: CATEGORIES.find((item) => item.id === category)?.label,
  demo: true,
});

export const PRODUCTS: Product[] = [
  demo(
    "black-gold",
    "Gold Intense · Eau de parfum",
    "perfumes",
    48900,
    "perfume-black-gold.webp",
    "Una fragancia cálida con un perfil profundo, presentada en un frasco oscuro con detalles dorados.",
    ["Amaderada y envolvente", "Presentación 50 ml", "Para día y noche"],
  ),
  demo(
    "midnight-opulence",
    "Midnight Opulence · EDP",
    "perfumes",
    57900,
    "perfume-midnight.webp",
    "Aroma intenso con una salida dulce y un fondo cálido. Una opción especial para la noche.",
    ["Dulce y cálida", "Presentación 50 ml", "Alta concentración"],
  ),
  demo(
    "maison-ambre",
    "Maison Ambre · Eau de parfum",
    "perfumes",
    62500,
    "perfume-maison.webp",
    "Una mezcla elegante de notas ambaradas en una presentación clásica y minimalista.",
    ["Ambarada", "Presentación 50 ml", "Aroma de larga duración"],
  ),
  demo(
    "velvet-noir",
    "Velvet Noir · Perfume intenso",
    "perfumes",
    45900,
    "perfume-taupe.webp",
    "Una fragancia nocturna de carácter suave, con una estela cálida y sofisticada.",
    ["Floral amaderada", "Presentación 75 ml", "Ideal para la noche"],
  ),
  demo(
    "blue-sport",
    "Blue Sport · Colonia masculina",
    "perfumes",
    38900,
    "perfume-blue.webp",
    "Una colonia fresca y dinámica para acompañar la rutina diaria.",
    ["Fresca y cítrica", "Presentación 100 ml", "Uso diario"],
  ),
  demo(
    "eau-clear",
    "Eau Clear · Fragancia unisex",
    "perfumes",
    54700,
    "perfume-clear.webp",
    "Una propuesta limpia y versátil con un perfil aromático liviano y equilibrado.",
    ["Fresca y unisex", "Presentación 75 ml", "Aroma versátil"],
  ),
  demo(
    "amber-classic",
    "Amber Classic · Eau de parfum",
    "perfumes",
    42900,
    "perfume-amber.webp",
    "Notas cálidas de ámbar para quienes prefieren una fragancia clásica y envolvente.",
    ["Ámbar y especias suaves", "Presentación 50 ml", "Un clásico diario"],
  ),
  demo(
    "crema-sensitive",
    "Crema corporal suave",
    "cremas",
    18900,
    "lotion-sensitive.webp",
    "Hidratación diaria para piel sensible, con una textura cómoda que se absorbe fácilmente.",
    ["Piel sensible", "Contenido 234 ml", "Sin fragancia intensa"],
  ),
  demo(
    "crema-hidratante",
    "Crema hidratante ligera",
    "cremas",
    16900,
    "body-lotion.webp",
    "Una crema liviana para sumar hidratación y suavidad a la rutina de todos los días.",
    ["Textura liviana", "Hidratación diaria", "Contenido ilustrativo"],
  ),
  demo(
    "locion-aloe",
    "Loción hidratante con aloe",
    "lociones",
    15900,
    "lotion-hydrating.webp",
    "Loción corporal de rápida absorción para dejar la piel suave y fresca.",
    ["Aloe y humectación", "Textura ligera", "Uso diario"],
  ),
  demo(
    "locion-nutritiva",
    "Loción nutritiva corporal",
    "lociones",
    17900,
    "lotion-sensitive.webp",
    "Una fórmula de muestra pensada para una rutina simple de cuidado corporal.",
    ["Nutrición diaria", "Piel suave", "Contenido 250 ml"],
  ),
  demo(
    "mascara-volumen",
    "Máscara de pestañas volumen",
    "maquillaje",
    12900,
    "mascara.webp",
    "Un esencial de maquillaje para definir y dar volumen a las pestañas.",
    ["Cepillo definido", "Color negro", "Fácil de aplicar"],
  ),
];

export const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

export const STORE = {
  name: "Perfumería",
  tagline: "Fragancias · cuidado personal · belleza",
  phone: "",
  whatsapp: "",
  instagram: "",
  tiktok: "",
};
