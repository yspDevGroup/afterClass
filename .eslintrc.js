module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-restricted-syntax': 0,
    'react-hooks/exhaustive-deps': 0,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    commonjs: true,
  },
};
