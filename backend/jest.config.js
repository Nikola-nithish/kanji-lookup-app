export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'services/**/*.js',
    '!**/node_modules/**'
  ],
  testTimeout: 30000
};
