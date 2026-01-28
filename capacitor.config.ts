import type { CapacitorConfig } from "@capacitor/core";

const config: CapacitorConfig = {
  appId: "com.legaltech.inmobiliaria",
  appName: "Inmobiliaria LegalTech",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https"
  }
};

export default config;

