

define('Test pagina aeropuerto', () => {

    beforeEach(() => {
        cy.visit('/aeropuerto')
        cy.MuestraAvion()
    })

    it('Test verifica botones', () => {
        cy.botonEvalua("be.visible", "Buscar", "boton-buscar-aero")
        cy.botonEvalua( "be.visible", "Reservar", "boton-reservar-aero")
    })

    it('Test verifica texto', () => {
        cy.comprueba('Pulse "Buscar" para ver todos los vuelos disponibles.', "msg1-aero")
        cy.comprueba('Pulse "Reservar" para reservar un vuelo o un parking.', "msg2-aero")
    })

})