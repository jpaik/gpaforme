module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "prettier/vue",
    "plugin:prettier/recommended",
  ],
  plugins: [
    'vue'
  ],
  globals: {
    $nuxt: true
  },
  rules: {
    'semi': [2, 'always'],
    "comma-dangle": ["error", "only-multiline"],
    'no-console': process.env.NODE_ENV === "production" ? "error" : "off",
    'vue/max-attributes-per-line': 'off',
    'vue/require-prop-types': 'off',
    'vue/html-closing-bracket-newline': ["off", {
      "singleline": "off",
      "multiline": "off"
    }],
    'prettier/prettier': ['error', {
      "endOfLine": "auto"
    }, {
      "usePrettierrc": false
    }]
  }
}
