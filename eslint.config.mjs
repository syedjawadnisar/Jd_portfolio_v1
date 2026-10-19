import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// The rule set `next lint` applied before Next 16 removed the command.
export default defineConfig([
  ...nextVitals,
  {
    // React Compiler checks that arrived with eslint-config-next 16. They warn
    // rather than fail. The immutability rule cannot tell a three.js object
    // mutated inside useFrame, which is how react-three-fiber is meant to be
    // used, from a React value. The others flag deliberate post-hydration
    // reads of browser state. Converting those is queued work, see TODO.
    rules: {
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "workspace/**"]),
]);
