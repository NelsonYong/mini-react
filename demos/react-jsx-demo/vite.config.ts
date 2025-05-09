import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import replace from "@rollup/plugin-replace";
import { resolvePkgPath } from "../../scripts/rollup/utils";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), replace({ __DEV__: true, preventAssignment: true })],
  resolve: {
    alias: [
      {
        find: "react",
        replacement: resolvePkgPath("react", true),
      },
      {
        find: "react-dom",
        replacement: resolvePkgPath("react-dom", true),
      },
      {
        find: "hostConfig",
        replacement: path.resolve(
          resolvePkgPath("react-dom"),
          "./src/hostConfig.ts"
        ),
      },
    ],
  },
});
