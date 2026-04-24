import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // `_`-prefixed args/vars are intentionally unused (convention for "I take
      // this parameter but don't need it"). Stop warning about them.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      // Disable react-hooks/set-state-in-effect: every flagged site in this repo
      // is a legitimate hydration/external-state-sync pattern (reading
      // localStorage on mount, mounted flag for next-themes, setting state
      // when framer-motion's inView flips). The rule is too strict for these.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
