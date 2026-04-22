// import { defineConfig } from 'vite'
// import path from 'path'
// import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react'


// function figmaAssetResolver() {
//   return {
//     name: 'figma-asset-resolver',
//     resolveId(id) {
//       if (id.startsWith('figma:asset/')) {
//         const filename = id.replace('figma:asset/', '')
//         return path.resolve(__dirname, 'src/assets', filename)
//       }
//     },
//   }
// }

// export default defineConfig({
//   plugins: [
//     figmaAssetResolver(),
//     // The React and Tailwind plugins are both required for Make, even if
//     // Tailwind is not being actively used – do not remove them
//     react(),
//     tailwindcss(),
//   ],
//   resolve: {
//     alias: {
//       // Alias @ to the src directory
//       '@': path.resolve(__dirname, './src'),
//     },
//   },

//   // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
//   assetsInclude: ['**/*.svg', '**/*.csv'],
// })
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return fileURLToPath(new URL(`./src/assets/${filename}`, import.meta.url));
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  assetsInclude: ["**/*.svg", "**/*.csv"],
  server: {
    port: 5173,
    proxy: {
      "/agents": "http://127.0.0.1:8000",
      "/policies": "http://127.0.0.1:8000",
      "/decisions": "http://127.0.0.1:8000",
      "/scenarios": "http://127.0.0.1:8000",
      "/evaluate-action": "http://127.0.0.1:8000",
      "/security-info": "http://127.0.0.1:8000",
      "/health": "http://127.0.0.1:8000",
      "/auth": "http://127.0.0.1:8000",
    },
  },
});