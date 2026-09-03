// jest.config.js
module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    testRegex: '.*\\.spec\\.ts$',
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: '../coverage',
    transformIgnorePatterns: [
        'node_modules/(?!(.*\\.mjs$|@nestjs/jwt|@nestjs/common|@nestjs/core))',
    ],
    extensionsToTreatAsEsm: ['.ts'],
};