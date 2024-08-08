describe('template spec', () => {
	it('passes', () => {
		cy.visit('http://127.0.0.1:6060/')
		const resultId = '#test-core-result'
		// coreAdd
		cy.get(resultId).should('have.html', '0')
		cy.get('#test-core-button').click()
		cy.get(resultId).should('have.html', '2')
		cy.get('#test-core-button').click()
		cy.get(resultId).should('have.html', '4')

		// coreIsString
		cy.get('#test-core-string').should('contain.html', 'is string')
		cy.get('#test-core-non-string').should('contain.html', 'is non-string')
	})
})
