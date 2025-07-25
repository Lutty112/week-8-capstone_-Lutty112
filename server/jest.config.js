module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
