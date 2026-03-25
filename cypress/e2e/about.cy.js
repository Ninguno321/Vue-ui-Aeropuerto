
describe('Test de la pagina about', () => {
    
    beforeEach(() => {
        cy.visit('/')
        cy.botonAbout()
    })
    
    it('Todo lo basico funciona', ()=> {
        cy.basicoFunciona()
    })

    it('Muestra texto about', () => {
        cy.get('[data-cy="texto-about"]').should('be.visible').and('contain', 'En UMUFly, nuestro público objetivo son los usuarios que dispongan de una credencial activa en la Universidad de Murcia.')
    })

    it('Muestra logo about', () => {
        cy.get('[data-cy="registrado-about"]').should('not.exist')
        cy.get('[data-cy="logo-about"]').should('be.visible')
        .click()
        cy.get('[data-cy="registrado-about"]').should('be.visible')
        cy.contains( '[data-cy="registrado-about"]' , /^Ya te has registrado */) 
    })

})