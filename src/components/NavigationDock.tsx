import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
export type DockItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  to?: string;
  onClick?: () => void;
  count?: number;
};
export function NavigationDock({
  label,
  context,
  items,
  visible = true,
}: {
  label: string;
  context: "customer" | "admin";
  items: DockItem[];
  visible?: boolean;
}) {
  const hidden = context === "customer" && !visible;
  return (
    <nav aria-label={label} aria-hidden={hidden || undefined} className={`bottom-dock ${context}-dock ${context === "customer" ? "perfume-customer-dock" : ""} ${hidden ? "" : "is-visible"}`}>
      {items.map(({ id, label: title, icon: Icon, active, to, onClick, count }) => {
        const content = (
          <>
            <span className="relative">
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              {count ? <span className="dock-count">{count}</span> : null}
            </span>
            <span>{title}</span>
          </>
        );
        const className = `bottom-dock-item ${active ? "is-active" : ""}`;
        return to ? (
          <Link
            key={id}
            to={to}
            className={className}
            aria-current={active ? "page" : undefined}
            aria-label={count ? `${title}, ${count} productos` : title}
          >
            {content}
          </Link>
        ) : (
          <button
            key={id}
            type="button"
            onClick={onClick}
            className={className}
            aria-current={active ? "page" : undefined}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
