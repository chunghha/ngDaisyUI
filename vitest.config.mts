/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "node:path";
// Angular vite plugin removed for test stability; templates are inlined

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
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
        "src/test.ts",
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
