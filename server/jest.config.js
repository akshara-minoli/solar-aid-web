export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  transform: {},
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Integration Test Report',
      outputPath: './test-report.html',
      includeFailureMsg: true
    }]
  ]
};
