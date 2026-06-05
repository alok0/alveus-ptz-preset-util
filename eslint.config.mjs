// @ts-check

import eslintReactUnified from "@eslint-react/eslint-plugin";
import eslint from "@eslint/js";
import prettierConfigs from "eslint-config-prettier";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import path from "node:path";
import tseslint from "typescript-eslint";

const dirname = path.resolve(new URL(".", import.meta.url).pathname);

const commonConfigs = defineConfig(
  { linterOptions: { reportUnusedDisableDirectives: "off" } },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  prettierConfigs,
);

export default defineConfig(
  {
    extends: [
      ...tseslint.configs.recommendedTypeCheckedOnly,
      {
        languageOptions: {
          parserOptions: {
            project: true,
            tsconfigDirName: dirname,
          },
        },
      },
      ...commonConfigs,

      eslintReactUnified.configs["strict-type-checked"],
      reactHooksPlugin.configs.flat["recommended-latest"],
      jsxA11yPlugin.flatConfigs.recommended,
      {
        rules: {
          "@typescript-eslint/no-unsafe-argument": "warn",
          "@typescript-eslint/no-unsafe-assignment": "warn",
          "@typescript-eslint/no-unsafe-call": "warn",
          "@typescript-eslint/no-unsafe-declaration-merging": "warn",
          "@typescript-eslint/no-unsafe-enum-comparison": "warn",
          "@typescript-eslint/no-unsafe-function-type": "warn",
          "@typescript-eslint/no-unsafe-member-access": "warn",
          "@typescript-eslint/no-unsafe-return": "warn",
          "@typescript-eslint/no-unsafe-type-assertion": "warn",
          "@typescript-eslint/no-unsafe-unary-minus": "warn",
        },
      },
    ],

    files: ["**/*.{ts,mts,cts,tsx}"],
    ignores: [".yarn/**"],
  },
  {
    extends: [...commonConfigs],

    files: ["*.cjs", "*.mjs"],
    ignores: [".yarn/**"],
  },
);
