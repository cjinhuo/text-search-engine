import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			require('@cypress/code-coverage/task')(on, config)
			return config
		},
		specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
	},
})
