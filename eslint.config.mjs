// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import eslintReactUnified from "@eslint-react/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import prettierConfigs from "eslint-config-prettier";
import path from "node:path";

const dirname = path.resolve(new URL(".", import.meta.url).pathname);

/**
 * @template T
 * @param {T|undefined|null|0|false|""} v
 * @returns {T}
 */
const requireTruthy = (v) => {
  if (!v) {
    throw new Error("required value not present");
  }
  return v;
};

const commonConfigs = tseslint.config(
  { linterOptions: { reportUnusedDisableDirectives: "off" } },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  prettierConfigs,
);

export default tseslint.config(
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
      {
        ...requireTruthy(reactPlugin.configs.flat["jsx-runtime"]),
        settings: { react: { version: "detect" } },
      },
      eslintReactUnified.configs["recommended-type-checked"],
      reactHooksPlugin.configs["recommended-latest"],
      jsxA11yPlugin.flatConfigs.recommended,
      {
        rules: {
          "react/display-name": "off",
          "react/prop-types": "off",
        },
      },
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
