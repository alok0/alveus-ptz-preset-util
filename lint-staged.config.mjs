/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  "!(*.ts|*.tsx)": ["prettier --write --ignore-unknown"],
  "*.{ts,tsx}": [
    "prettier --write",
    () => "yarn tsc --noEmit",
    "yarn eslint --no-warn-ignored --max-warnings 0",
  ],
};
