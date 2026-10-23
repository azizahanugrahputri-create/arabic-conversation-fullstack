import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: "#173f35",
        leaf: "#2e6955",
        mint: "#e7f0e9",
        sand: "#f6f5ef",
        gold: "#d9b66f",
        ink: "#1d2925",
        muted: "#6f7b75"
      },
      boxShadow: {
        soft: "0 12px 35px rgba(23, 63, 53, 0.07)"
      }
    },
  },
  plugins: [],
};
export default config;
