import type {Config} from 'jest';

// Set required env vars before any module is imported
process.env.APP_API_BASE_URL = 'http://localhost:3000';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {url: 'http://localhost'},
  setupFilesAfterEnv: ['<rootDir>/src/lib/setup-tests.ts'],
  transform: {'^.+\\.tsx?$': ['ts-jest', {tsconfig: 'tsconfig.test.json'}]},
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/src/__mocks__/svgMock.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.scss$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp)$': '<rootDir>/src/__mocks__/fileMock.ts',
    '\\.css$': 'identity-obj-proxy',
  },
  // coverageThreshold: {
  //   global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  // },
};

export default config;
