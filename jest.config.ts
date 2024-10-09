import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js
  dir: './',
});

// Add any custom config to be passed to Jest
/** @tpye {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
};

// creatJestConfig is exported this way to ensure that next/jest can be used with ESM imports
module.exports = createJestConfig(config);
