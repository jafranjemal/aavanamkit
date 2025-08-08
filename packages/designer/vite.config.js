// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path"; // <-- Import resolve from path

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Library mode configuration
  build: {
    lib: {
      entry: resolve(__dirname, "src/AavanamKit.jsx"), // <-- Your library's entry point
      name: "AavanamKit",
      fileName: (format) => `aavanam-kit.${format}.js`,
    },
    cssCodeSplit: true,
    rollupOptions: {
      // Make sure to externalize dependencies that shouldn't be bundled
      // into your library
      external: [
        "react",
        "react-dom",
        "konva",
        "react-konva",
        "jspdf",
        "jsbarcode",
        "uuid",
        "use-image",
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          konva: "Konva",
          "react-konva": "ReactKonva",
          jspdf: "jsPDF",
          jsbarcode: "JsBarcode",
          uuid: "uuid",
          "use-image": "useImage",
        },
      },
    },
  },
});
