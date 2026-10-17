import { Link } from "react-router-dom";
import { ArrowRight, Headphones, Instagram } from "lucide-react";
import type { ReactNode } from "react";
import { adminEntry } from "@/lib/storeConfig";
import { STORE } from "@/lib/products";
import { WhatsAppGlyph } from "@/components/WhatsAppGlyph";

function SocialIcon({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: ReactNode;
}) {
  const className = "perfume-footer-social";
  if (!href) {
    return <span className={`${className} is-unconfigured`} aria-label={`${label} (sin configurar)`} title={`${label}: sin configurar`}>{children}</span>;
  }
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{children}</a>;
}

function TikTokGlyph() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M19.7 7.1a6.1 6.1 0 0 1-3.8-1.4v8.1a5.3 5.3 0 1 1-4.6-5.2v3.2a2.2 2.2 0 1 0 1.4 2.1V2h3.2a5.8 5.8 0 0 0 3.7 3v2.1Z" /></svg>;
}

const whatsappHref = STORE.whatsapp
  ? `https://wa.me/${STORE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${STORE.name}, tengo una consulta.`)}`
  : undefined;

export const FooterOption1 = () => (
  <footer className="perfume-footer" aria-label="Información de la tienda">
    <div className="perfume-footer-main">
      <div className="perfume-footer-brand">
        <Link to="/" aria-label={`${STORE.name} · Inicio`}>
          <img src="/perfumeria-logo.svg" alt={STORE.name} width="190" height="66" />
        </Link>
        <p>Fragancias que te acompañan<br />en cada momento.</p>
        <div className="perfume-footer-socials" aria-label="Redes sociales">
          <SocialIcon href={STORE.instagram || undefined} label="Instagram de Perfumería"><Instagram size={19} strokeWidth={1.8} /></SocialIcon>
          <SocialIcon href={STORE.tiktok || undefined} label="TikTok de Perfumería"><TikTokGlyph /></SocialIcon>
          <SocialIcon href={whatsappHref} label="WhatsApp de Perfumería"><WhatsAppGlyph /></SocialIcon>
        </div>
      </div>
      <div className="perfume-footer-help">
        <Headphones size={21} strokeWidth={1.6} aria-hidden="true" />
        <div>
          <strong>¿Necesitás ayuda?</strong>
          <p>Escribinos por WhatsApp.<br />Te asesoramos personalmente.</p>
        </div>
        {whatsappHref ? (
          <a className="perfume-footer-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <WhatsAppGlyph /> Hablar por WhatsApp <ArrowRight size={16} />
          </a>
        ) : (
          <span className="perfume-footer-whatsapp is-disabled" aria-disabled="true">WhatsApp pendiente de configurar</span>
        )}
      </div>
    </div>
    <nav className="perfume-footer-legal" aria-label="Información y políticas">
      <details>
        <summary>Política de privacidad</summary>
        <p>Pendiente de definir con el comercio antes de publicar la tienda.</p>
      </details>
      <details>
        <summary>Términos y condiciones</summary>
        <p>Los productos y precios visibles son de muestra; disponibilidad y condiciones deben confirmarse con la tienda.</p>
      </details>
      <Link to="/contacto">Envíos y atención</Link>
    </nav>
    <div className="perfume-footer-meta">
      <p>
        <Link to={adminEntry} aria-label="Abrir el panel de Perfumería">© 2026 {STORE.name}</Link>
        <span> · Córdoba · Precios de muestra</span>
      </p>
      <a
        className="perfume-footer-credit"
        href="https://hikari-brandan.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hecho por Hikari Studio (abre en una pestaña nueva)"
      >
        Made by <span>Hikari Studio</span>
      </a>
    </div>
  </footer>
);
export const FooterOption2 = FooterOption1;
export const FooterOption3 = FooterOption1;
