import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, LayoutGrid, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { NavigationDock } from "./NavigationDock";
const destinations = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/catalogo", label: "Catálogo", icon: LayoutGrid },
  { to: "/contacto", label: "Contacto", icon: MessageCircle },
  { to: "/carrito", label: "Bolsa", icon: ShoppingBag },
];
export function CustomerBottomNav() {
  const { count } = useCart();
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(() => window.scrollY > 80);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 80);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <NavigationDock
      label="Navegación de la tienda"
      context="customer"
      visible={visible}
      items={destinations.map((item) => ({
        ...item,
        id: item.to,
        active:
          item.to === "/catalogo"
            ? pathname === item.to || pathname.startsWith("/producto/")
            : pathname === item.to,
        count: item.to === "/carrito" ? count : undefined,
      }))}
    />
  );
}
export const MobileNav = CustomerBottomNav;
