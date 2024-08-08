/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	// projects: ['<rootDir>', '<rootDir>/packages/*'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	moduleFileExtensions: ['js', 'ts'],
	testMatch: ['**/*.spec.ts'],
}
