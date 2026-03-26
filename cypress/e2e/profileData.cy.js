define('Test paso de datos del DNI desde pagina profile buscar a registro',() => {
    it('Test paso datos profile', () => {
        cy.visit('/profile')
        cy.get('[data-cy="cuadro-texto-dni-profile"]').type("47448089D")
        cy.get('[data-cy="boton-registro-profile"]').click()
        cy.evaluaDentroPadre("form-d", "label", "input", "DNI", "not.have.class", "p-invalid")
    })
})