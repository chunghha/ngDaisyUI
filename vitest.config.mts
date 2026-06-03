/// <reference types="vitest" />
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
// Angular vite plugin removed for test stability; templates are inlined

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@app": path.resolve(rootDir, "src/app"),
    },
  },
  // plugins: [] // Angular plugin removed (templates inlined)
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/setupTest.js"],
    exclude: ["dist/**", "dist/test-out/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "coverage",
      // Restrict coverage collection strictly to source files under src (TypeScript only)
      include: ["src/**/*.ts"],
      // Exclude test files, setup, type declarations, and bootstrap main
      exclude: [
        "node_modules/**",
        "dist/test-out/**",
        "src/**/*.spec.*",
        "src/main.ts",
        "src/app/app.config.ts",
        "src/**/*.d.ts",
        "src/setupTest.*",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
});
