module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    requireConfigFile: false,
  },
  rules: {
    'no-console': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['./test.js', './tests/**'],
      },
    ],
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    'operator-linebreak': ['off', 'before'],
    'implicit-arrow-linebreak': ['off', 'before'],
    'valid-typeof': ['off'],
    indent: ['off', 2],
  },
};
