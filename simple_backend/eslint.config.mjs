/* By David Mberingabo */
import { defineConfig } from "eslint/config";
import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import sql from "eslint-plugin-sql"
import promise from "eslint-plugin-promise"
import { createRequire } from 'module';
import securityNode from "eslint-plugin-security-node";
import sonarjs from "eslint-plugin-sonarjs";
import nodePlugin from "eslint-plugin-n";

const require = createRequire(import.meta.url);

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {...globals.browser, ...globals.node}
    }
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '.next/',
      'out/',
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { eslint },
    extends: ["eslint/recommended"],
    rules: {
      "no-unused-labels": "warn",
      "no-useless-catch": "warn",
      "no-empty": "warn"
    } // Disabling an eslint rule
  },
  sonarjs.configs.recommended,
  nodePlugin.configs["flat/recommended"],
  tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {tseslint},
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",

      /** SECURITY RELATED RULES */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
    }
  },
  security.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: {security},
    rules: {
      "security/detect-object-injection": "error",
      "security/detect-non-literal-fs-filename": "error",
    }
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: {noUnsanitized},
    rules: {
        "noUnsanitized/method": "error",
        "noUnsanitized/property": "error",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: {sql},
    rules: {
      // Enable linting of SQL in backtick strings using the 'sql' tag
      'sql/format': [
        'error',
        {
          ignoreExpressions: true,
          ignoreInline: true,
          ignoreStartWithNewLine: true,
          ignoreTagless: true,
          retainBaseIndent: true,
          sqlTag: 'sql', // This tells it to lint only tagged templates like sql`...`
        },
      ],
      'sql/no-unsafe-query': ['error', {allowLiteral: false,},],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: {promise},
    rules: {
      "promise/always-return": "error",
      "promise/catch-or-return": "error",
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",
      "promise/no-new-statics": "error",
      "promise/no-multiple-resolved": "error",
      "promise/valid-params": "error",
      "promise/no-nesting": "error",
      "promise/no-return-in-finally": "error",
      "promise/no-promise-in-callback": "error",
      "promise/no-callback-in-promise": "error"
    }
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: {"security-node": securityNode},
    rules: {
      // Security-Node does not have a formal 'recommended' for Flat Config yet
      ...securityNode.configs.recommended.rules,
    }
  }
]);
