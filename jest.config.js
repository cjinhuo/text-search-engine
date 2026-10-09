/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'node',
	transform: {
		'^.+\\.tsx?$': [
			'@swc/jest',
			{
				jsc: { parser: { syntax: 'typescript', tsx: true }, target: 'es2015' },
			},
		],
	},
	moduleFileExtensions: ['js', 'ts', 'tsx'],
	testMatch: ['**/*.spec.ts'],
}
