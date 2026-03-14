// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import ts from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import vue from "eslint-plugin-vue";
import react from "eslint-plugin-react";

export default [{
  files: ["**/*.{ts,tsx,vue}"],
  languageOptions: {
    parser,
  },
  plugins: {
    "@typescript-eslint": ts,
    vue,
    react,
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
  },
}, ...storybook.configs["flat/recommended"]];
