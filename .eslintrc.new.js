// Use the old .eslintrc.js format for now since the new flat config has issues with TypeScript
module.exports = {
  extends: ['expo'],
  ignorePatterns: [
    '/dist/*',
    'rootStore.example.ts',
    'nativewind-env.d.ts',
    'node_modules/*',
    '.expo/*',
    'web-build/*',
    'firebase-*.js',
    'test-*.js',
    '*.config.js',
    '*.config.ts'
  ],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
};
