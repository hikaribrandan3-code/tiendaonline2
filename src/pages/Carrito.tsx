import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, MapPin, Check, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStoreProducts } from "@/lib/useStoreProducts";
import { cartItemKey, useCart } from "@/lib/cart";
import { formatARS, STORE } from "@/lib/products";
import { storefrontDb as supabase } from "@/lib/storefrontDb";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WhatsAppGlyph } from "@/components/WhatsAppGlyph";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Carrito() {
  const { items, setQty, setSize, remove, total, clear } = useCart();
  const { products } = useStoreProducts();
  const isDemo = items.some((item) => item.product.demo);
  const [demoConfirmed, setDemoConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("pickup");
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [customerLat, setCustomerLat] = useState<number | null>(null);
  const [customerLon, setCustomerLon] = useState<number | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Load delivery settings
  useEffect(() => {
    if (!items.length || isDemo) return;
    async function loadDeliverySettings() {
      const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
      const ownerId = profiles?.[0]?.id;
      if (ownerId) {
        const { data } = await supabase
          .from("delivery_settings")
          .select("delivery_price")
          .eq("user_id", ownerId)
          .single();
        if (data) setDeliveryPrice(data.delivery_price);
      }
    }
    void loadDeliverySettings().catch(() => setDeliveryPrice(0));
  }, [items.length, isDemo]);

  const getLocation = async () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomerLat(position.coords.latitude);
          setCustomerLon(position.coords.longitude);
          setLoadingLocation(false);
          toast.success("Ubicación detectada");
        },
        () => {
          setLoadingLocation(false);
          toast.error("No pudimos acceder a tu ubicación");
        },
      );
    }
  };

  const effectiveDeliveryPrice = isDemo ? 3500 : deliveryPrice;
  const finalTotal = deliveryMethod === "delivery" ? total + effectiveDeliveryPrice : total;

  if (demoConfirmed)
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white">
          <Check size={28} />
        </div>
        <p className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground">
          Perfumería · Demo
        </p>
        <h1 className="mt-3 text-3xl font-medium">Así se vería tu confirmación.</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Tu selección suma {formatARS(finalTotal)}. Esta es una vista de muestra: no se realizó un
          cobro ni se envió un pedido.
        </p>
        <Button className="mt-7 rounded-full" onClick={() => setDemoConfirmed(false)}>
          Volver a mi carrito
        </Button>
        <Link to="/" className="mt-4 block text-sm underline">
          Seguir explorando
        </Link>
      </div>
    );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-5 lg:px-8">
        <section className="mx-auto max-w-lg py-12 text-center sm:py-16">
          <span className="empty-cart-emblem" aria-hidden="true">
            <ShoppingBag size={29} strokeWidth={1.45} />
            <span>PRIVATE SELECTION</span>
          </span>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            Tu carrito está vacío
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Elegí tus favoritos de la colección y armá tu próximo ritual.
          </p>
          <Link
            to="/catalogo"
            className="empty-cart-cta mx-auto mt-6 flex min-h-12 w-[min(82vw,300px)] items-center justify-center gap-3 rounded-full px-5 text-sm font-medium"
          >
            Ver catálogo <ArrowRight size={17} />
          </Link>
        </section>
        <section className="border-t border-black/5 pt-6" aria-labelledby="recommendations-title">
          <p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground">
            QUIZÁS TE GUSTE
          </p>
          <div className="mb-5 mt-1 flex items-center justify-between gap-3">
            <h2 id="recommendations-title" className="text-lg font-semibold sm:text-2xl">
              Populares de la colección
            </h2>
            <Link
              to="/catalogo"
              className="flex min-h-11 shrink-0 items-center gap-2 text-xs underline underline-offset-4"
            >
              Ver todo <ArrowRight size={15} />
            </Link>
          </div>
          <div className="store-gallery-track flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
            {products.slice(0, 3).map((product) => (
              <Link
                key={product.id}
                to={`/producto/${product.id}`}
                className="w-[58vw] max-w-64 shrink-0 snap-start overflow-hidden rounded-2xl bg-white sm:w-60"
              >
                <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-contain p-4"
                  />
                </div>
                <div className="p-3">
                  <h3 className="truncate text-sm font-medium">{product.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{formatARS(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (items.some((item) => item.product.has_sizes && !item.product.selectedSize)) {
      toast.error("Revisá las opciones de cada producto antes de continuar.");
      return;
    }
    if (isDemo) {
      setShowModal(false);
      setDemoConfirmed(true);
      return;
    }
    setSending(true);
    try {
      const orderItems = items.map((i) => ({
        id: i.product.id,
        name: i.product.title,
        qty: i.qty,
        price: i.product.price,
        size: i.product.selectedSize ?? null,
      }));

      // Find owner's user_id (single owner shop — get first profile)
      const { data: profiles } = await supabase.from("profiles").select("id,phone").limit(1);
      const destination = profiles?.[0]?.phone?.replace(/\D/g, "");
      if (!destination) {
        toast.error("El contacto de la tienda todavía no está configurado.");
        setSending(false);
        return;
      }
      const ownerId = profiles?.[0]?.id;

      if (ownerId) {
        const { error: orderError } = await supabase.from("orders").insert({
          user_id: ownerId,
          customer_name: name,
          customer_phone: phone,
          items: orderItems,
          total: finalTotal,
          delivery_method: deliveryMethod,
          customer_latitude: customerLat,
          customer_longitude: customerLon,
        });
        if (orderError) {
          console.error("Failed to save order:", orderError);
          toast.error("No pudimos guardar tu pedido, pero podés seguir por WhatsApp");
        }

        const { error: customerError } = await supabase
          .from("shop_customers")
          .upsert(
            { user_id: ownerId, phone, name, updated_at: new Date().toISOString() },
            { onConflict: "user_id,phone" },
          );
        if (customerError) console.error("Failed to upsert customer:", customerError);
      }

      const deliveryText =
        deliveryMethod === "delivery"
          ? `Envío a domicilio (+${formatARS(effectiveDeliveryPrice)})`
          : "Retiro en tienda (gratis)";

      const lines = items
        .map((i) => `• ${i.product.title} x${i.qty} — ${formatARS(i.product.price * i.qty)}`)
        .join("\n");
      const text = encodeURIComponent(
        `Hola ${STORE.name}, soy ${name} (${phone}).\n\nQuiero hacer este pedido:\n\n${lines}\n\n${deliveryText}\n\nTotal: ${formatARS(finalTotal)}`,
      );
      window.open(`https://wa.me/${destination}?text=${text}`, "_blank");
      toast.success("¡Pedido enviado!", { description: "Te esperamos para coordinar el envío." });
      setSending(false);
      setShowModal(false);
      setTimeout(() => clear(), 1500);
    } catch {
      toast.error("No pudimos completar el pedido. Intentá de nuevo o contactanos.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="perfume-cart-page mx-auto max-w-6xl px-4 pb-8 lg:px-8">
      <header className="perfume-cart-heading">
        <p className="home-overline">TU SELECCIÓN</p>
        <h1>Tu carrito</h1>
        <p>Revisá tus productos y enviá tu pedido por WhatsApp.</p>
      </header>

      {isDemo && (
        <p className="perfume-demo-banner">
          Vista de muestra · los precios son ilustrativos. No se realiza un pago ni se envía un pedido real.
        </p>
      )}
      <div className="perfume-cart-layout">
        <ul className="perfume-cart-items">
          {items.map((item) => (
            <li
              key={cartItemKey(item.product)}
              className="perfume-cart-item"
            >
              <Link to={`/producto/${item.product.id}`} className="perfume-cart-item-image shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  loading="lazy"
                  width={96}
                  height={96}
                  className="h-full w-full object-contain p-2"
                />
              </Link>
              <div className="perfume-cart-item-info">
                <Link to={`/producto/${item.product.id}`} className="hover:underline">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {item.product.brand}
                  </p>
                  <h2 className="break-words font-medium leading-tight">
                    {item.product.title}
                  </h2>
                  <p>{item.product.specs.slice(0, 2).join(" · ")}</p>
                </Link>

                {/* Size selector if product has sizes */}
                {item.product.has_sizes && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {(item.product.sizes ? Object.keys(item.product.sizes) : SIZES).map((size) => {
                      const isAvailable = item.product.sizes?.[size] !== false;
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            setSize(cartItemKey(item.product), size);
                          }}
                          className={`min-h-11 min-w-11 text-[10px] px-2 py-1 rounded transition ${
                            !isAvailable
                              ? "bg-secondary text-muted-foreground line-through opacity-40"
                              : item.product.selectedSize === size
                                ? "bg-foreground text-background font-medium"
                                : "border border-border text-muted-foreground hover:border-foreground"
                          }`}
                          disabled={!isAvailable}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
              <div className="perfume-cart-item-actions">
                <button type="button" onClick={() => remove(cartItemKey(item.product))} aria-label={`Eliminar ${item.product.title}`} className="perfume-cart-delete">
                  <Trash2 size={17} />
                </button>
                <strong className="perfume-cart-item-price">{formatARS(item.product.price * item.qty)}</strong>
                <div className="perfume-quantity" aria-label={`Cantidad de ${item.product.title}`}>
                  <button type="button" onClick={() => setQty(cartItemKey(item.product), item.qty - 1)} aria-label={`Quitar una unidad de ${item.product.title}`}><Minus size={14} /></button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => setQty(cartItemKey(item.product), item.qty + 1)} aria-label={`Sumar una unidad de ${item.product.title}`}><Plus size={14} /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="perfume-cart-summary">
          <div className="perfume-cart-total">
            <div className="perfume-cart-total-label">
              <span><Sparkles size={18} /></span>
              <div><strong>Total estimado</strong><small>{items.reduce((sum, item) => sum + item.qty, 0)} productos · {isDemo ? "precios de muestra" : "selección"}</small></div>
            </div>
            <strong>{formatARS(finalTotal)}</strong>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            size="lg"
            className="perfume-cart-whatsapp"
          >
            <WhatsAppGlyph className="perfume-wa-glyph" /> Enviar pedido por WhatsApp <ArrowRight size={17} />
          </Button>
          <p className="perfume-cart-note">No se realiza un pago online. Coordinamos por WhatsApp la confirmación, disponibilidad y entrega.</p>
        </aside>
      </div>

      <section className="perfume-cart-related" aria-labelledby="related-title">
        <p className="home-overline">TAL VEZ TE GUSTE</p>
        <h2 id="related-title">Otros perfumes</h2>
        <div className="perfume-cart-related-grid">
          {products.filter((product) => product.category === "perfumes" && !items.some((item) => item.product.id === product.id)).slice(0, 3).map((product) => (
            <Link key={product.id} to={`/producto/${product.id}`} className="perfume-cart-related-item">
              <img src={product.image} alt={product.title} loading="lazy" />
              <span><strong>{product.title}</strong><small>{product.specs[0]}</small><small>{formatARS(product.price)}</small></span>
              <em><Plus /></em>
            </Link>
          ))}
        </div>
      </section>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-h-[90dvh] max-w-md overflow-y-auto rounded-3xl p-6">
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            {isDemo
              ? "Una muestra del proceso de compra. No se generan pedidos ni cobros."
              : "Completá tus datos para coordinar tu pedido."}
          </DialogDescription>
          <form onSubmit={checkout} className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-secondary/70 p-3">
              <img
                src={items[0]?.product.image}
                alt="Tu selección"
                className="h-12 w-12 rounded-xl bg-[#eeedf1] object-contain p-1"
              />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Tu selección</p>
                <p className="mt-1 text-sm font-medium">
                  {items.reduce((sum, item) => sum + item.qty, 0)} productos
                </p>
              </div>
              <span className="text-sm font-semibold">{formatARS(finalTotal)}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-name">Tu nombre</Label>
              <Input
                required={!isDemo}
                id="checkout-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="¿Cómo te llamás?"
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-phone">Tu teléfono</Label>
              <Input
                required={!isDemo}
                id="checkout-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 9 11 0000-0000"
                className="rounded-full"
              />
            </div>

            {/* Delivery method selection */}
            <div className="space-y-2">
              <Label>Cómo querés recibirlo</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`flex-1 min-h-11 py-2 rounded-full text-sm font-medium transition ${
                    deliveryMethod === "pickup"
                      ? "bg-foreground text-background"
                      : "border border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  Retiro Gratis
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`flex-1 min-h-11 py-2 rounded-full text-sm font-medium transition ${
                    deliveryMethod === "delivery"
                      ? "bg-foreground text-background"
                      : "border border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  Envío ({formatARS(effectiveDeliveryPrice)})
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 p-3 text-xs">
              <p className="font-medium">Forma de pago</p>
              <p className="mt-1 text-muted-foreground">
                A coordinar con el local al confirmar tu pedido.
              </p>
            </div>
            {/* Location detection for delivery */}
            {deliveryMethod === "delivery" && !isDemo && (
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={getLocation}
                  disabled={loadingLocation}
                  variant="outline"
                  className="w-full rounded-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {loadingLocation
                    ? "Detectando..."
                    : customerLat
                      ? "✓ Ubicación detectada"
                      : "Detectar mi ubicación"}
                </Button>
              </div>
            )}

            <Button
              type="submit"
              disabled={sending || (!isDemo && deliveryMethod === "delivery" && !customerLat)}
              size="lg"
              className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium"
            >
              {sending ? "Enviando..." : isDemo ? "Confirmar demo" : "Confirmar y coordinar pedido"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
