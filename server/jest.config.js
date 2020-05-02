module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^utils(.*)$': '<rootDir>/utils$1',
    '^services(.*)$': '<rootDir>/services$1',
    '^interfaces(.*)$': '<rootDir>/interfaces$1',
  },
};
