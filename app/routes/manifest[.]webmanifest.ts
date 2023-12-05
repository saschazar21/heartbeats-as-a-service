import { json, type LoaderFunction } from "@remix-run/cloudflare";
import pkg from "../../package.json";

export const manifest = {
  short_name: pkg.short_name,
  name: pkg.short_name,
  start_url: "/",
  display: "standalone",
  background_color: "#f7f3e3",
  theme_color: pkg.color,
  description: pkg.description,
  icons: [
    {
      src: "/android-chrome-maskable-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/android-chrome-maskable-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
  ],
  screenshots: [
    {
      form_factor: "narrow",
      label: "Mobile light mode",
      sizes: "750x1334",
      src: "/screenshots/screenshot_mobile_light.png",
      type: "image/png",
    },
    {
      form_factor: "narrow",
      label: "Mobile dark mode",
      sizes: "750x1334",
      src: "/screenshots/screenshot_mobile_dark.png",
      type: "image/png",
    },
    {
      form_factor: "wide",
      label: "Desktop light mode",
      sizes: "2160x1620",
      src: "/screenshots/screenshot_desktop_light.png",
      type: "image/png",
    },
    {
      form_factor: "wide",
      label: "Desktop dark mode",
      sizes: "2160x1620",
      src: "/screenshots/screenshot_desktop_dark.png",
      type: "image/png",
    },
  ],
};

export const loader: LoaderFunction = async () => {
  return json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=600",
      "Content-Type": "application/manifest+json",
    },
  });
};
