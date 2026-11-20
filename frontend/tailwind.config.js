/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        card: "#1c1c1e",
        card2: "#2c2c2e",
        /* Aksen mengikuti tema yang dipilih di Pengaturan > Umum
           (CSS variable --vity-accent, default biru #0a84ff). */
        accent: "var(--vity-accent, #0a84ff)",
        danger: "#ff453a",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
}
