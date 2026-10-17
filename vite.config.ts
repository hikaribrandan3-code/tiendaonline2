import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const publicOrigin = (
  process.env.VITE_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://tiendaonline2.vercel.app"),
).replace(/\/$/, "");

export default defineConfig({
  plugins: [
    {
      name: "perfumeria-public-origin",
      transformIndexHtml: (html) => html.replaceAll("__PUBLIC_ORIGIN__", publicOrigin),
    },
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
