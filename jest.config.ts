// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
     // Aggiungi questo se nextJest non lo gestisce e hai errori con import CSS/SCSS
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  // Modificato per includere file .test.tsx accanto ai componenti
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)', // Mantiene la possibilità di usare __tests__
    '**/?(*.)+(spec|test).[jt]s?(x)'    // Aggiunge la ricerca per file .spec o .test accanto ai componenti
  ],
};

export default createJestConfig(config);