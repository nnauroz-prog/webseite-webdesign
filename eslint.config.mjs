import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Deutsche typografische Anführungszeichen („" ‚') und Apostrophe
      // sind in JSX-Textinhalten valide und rendern korrekt. Die Regel
      // ist gedacht, um Attribut-Begrenzer-Verwechslung zu verhindern,
      // erzeugt aber in unserer deutschen Marketing-Prosa nur Lärm.
      "react/no-unescaped-entities": "off",
      // React-Compiler-Regel, die alle setState-Calls in useEffect
      // bemängelt. Sinnvolle Empfehlung für Pure-Sync-Effects, aber
      // unsere Effects sind durchgängig externe Sync (setInterval-Ticks,
      // IntersectionObserver, sessionStorage-Checks, MediaQuery-Listen).
      // In diesen Fällen ist setState im Effect das richtige Muster.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
