module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^utils(.*)$': '<rootDir>/src/utils$1',
    '^components(.*)$': '<rootDir>/src/components$1',
    '^store(.*)$': '<rootDir>/src/store$1',
    '^types(.*)$': '<rootDir>/src/types$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
