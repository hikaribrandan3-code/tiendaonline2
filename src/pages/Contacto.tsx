import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock3, Instagram, MapPin, MessageCircle, Store } from "lucide-react";
import { STORE } from "@/lib/products";
import { storefrontDb as supabase } from "@/lib/storefrontDb";

export default function Contacto() {
  const [profile, setProfile] = useState<{
    phone: string | null;
    instagram_url: string | null;
  } | null>(null);

  useEffect(() => {
    const ownerId = import.meta.env.VITE_RE_STORE_OWNER_ID;
    if (!ownerId) return;
    let active = true;
    void (async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("phone,instagram_url")
          .eq("id", ownerId)
          .maybeSingle();
        if (active) setProfile(data);
      } catch {
        // Contact channels are optional in the demo.
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const contactPhone = profile?.phone || STORE.whatsapp;
  const whatsappHref = contactPhone
    ? `https://wa.me/${contactPhone.replace(/\D/g, "")}`
    : undefined;
  const instagramHref = profile?.instagram_url || STORE.instagram;

  return (
    <main className="mx-auto max-w-4xl px-5 py-6 sm:py-10">
      <header className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-muted-foreground">
          {STORE.name} · Córdoba
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Estamos para ayudarte.</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Escribinos por fragancias, cremas o productos de cuidado personal.
        </p>
      </header>

      <div className="mx-auto mt-6 grid max-w-3xl gap-3 text-left sm:mt-8 sm:grid-cols-2">
        {whatsappHref ? (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-black/8 bg-white/80 p-4 transition hover:border-black/20 hover:bg-white sm:p-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"><MessageCircle size={18} /></span>
            <div className="mt-4 flex items-center justify-between gap-2"><span className="text-sm font-medium">WhatsApp</span><ArrowUpRight size={16} /></div>
            <p className="mt-1 text-xs text-muted-foreground">Consultas y pedidos</p>
          </a>
        ) : (
          <div className="rounded-2xl border border-black/8 bg-white/80 p-4 sm:p-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"><MessageCircle size={18} /></span>
            <p className="mt-4 text-sm font-medium">WhatsApp</p>
            <p className="mt-1 text-xs text-muted-foreground">Canal de contacto pendiente de configurar.</p>
          </div>
        )}

        {instagramHref ? (
          <a href={instagramHref} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-black/8 bg-white/80 p-4 transition hover:border-black/20 hover:bg-white sm:p-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"><Instagram size={18} /></span>
            <div className="mt-4 flex items-center justify-between gap-2"><span className="text-sm font-medium">Instagram</span><ArrowUpRight size={16} /></div>
            <p className="mt-1 text-xs text-muted-foreground">Novedades y productos de la tienda</p>
          </a>
        ) : (
          <div className="rounded-2xl border border-black/8 bg-white/80 p-4 sm:p-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"><Instagram size={18} /></span>
            <p className="mt-4 text-sm font-medium">Instagram</p>
            <p className="mt-1 text-xs text-muted-foreground">Perfil pendiente de configurar.</p>
          </div>
        )}

        <div className="rounded-2xl border border-black/8 bg-white/80 p-4 sm:p-5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"><MapPin size={18} /></span>
          <p className="mt-4 text-sm font-medium">Ubicación</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Córdoba, Argentina<br />Consultá por WhatsApp antes de visitarnos.</p>
        </div>

        <div className="rounded-2xl border border-black/8 bg-white/80 p-4 sm:p-5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"><Clock3 size={18} /></span>
          <p className="mt-4 text-sm font-medium">Horarios</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Lunes a sábado · 9:00 a 18:00<br />Horario de muestra</p>
        </div>

        <div className="rounded-2xl bg-black p-4 text-white sm:col-span-2 sm:p-5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15"><Store size={18} /></span>
          <p className="mt-4 text-sm font-medium">Fragancias y cuidado personal</p>
          <p className="mt-1 text-xs text-white/65">Consultanos por disponibilidad, presentaciones y recomendaciones.</p>
        </div>
      </div>

      <p className="mt-4 text-center text-[10px] text-muted-foreground">Los datos de atención son de muestra para esta demo.</p>
      <Link to="/catalogo" className="mt-6 inline-block text-sm underline underline-offset-4">Volver a la colección</Link>
    </main>
  );
}
