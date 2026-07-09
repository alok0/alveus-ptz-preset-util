/** @type {import("prettier").Config} */
const config = {
  trailingComma: "all",
  overrides: [
    {
      files: "./src/database.json",
      options: { printWidth: 200, objectWrap: "collapse" },
    },
  ],
};

export default config;
