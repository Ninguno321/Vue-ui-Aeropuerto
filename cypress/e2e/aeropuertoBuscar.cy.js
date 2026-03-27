


describe('Test pagina aeropuerto / buscar', () => {

    beforeEach(()=>{
        cy.visit('/aeropuerto')
    })


    it('Boton de buscar funciona', () => {
        cy.get('[data-cy="boton-buscar-aero"]').click()
        cy.url().should('include', '/buscar/vuelos')
    })

    it('Botones desaparecen al pulsar buscar y aparece volver', () => {
        cy.get('[data-cy="boton-buscar-aero"]').click()
        cy.evaluaNoExiste("boton-buscar-aero")
        cy.evaluaNoExiste("boton-reservar-aero")
        cy.comprueba("Volver","volver-aero-buscar")
    })

    
    it('Comprueba que sale mensaje no vuelos disponibles', ()=> {

        cy.intercept('GET', '**/public/vuelo*', { body: { content: [], totalElements: 0 } }).as('getVuelos')        
        cy.get('[data-cy="boton-buscar-aero"]').click()        
        cy.wait('@getVuelos')

        cy.comprueba("No hay vuelos disponibles, lamentamos las molestias.","msg-no-vuelos-buscar")

        cy.botonEvalua("be.disabled", "Reservar", "boton-reservar-vuelos")  
    })


    Cypress.Commands.add('botonEvaluaPlus', (texto, id, atributo, valorAtributo) => {
    cy.get(`[data-cy="${id}"]`)
    .should(valorAtributo, atributo)
})
    it('Comprueba que salen los vuelos (2)', ()=> {

        cy.intercept('GET', '**/public/vuelo*', { fixture: 'vuelos.json' }).as('getVuelos')        
        cy.get('[data-cy="boton-buscar-aero"]').click()        
        cy.wait('@getVuelos')

        cy.compruebaCelda("form-vuelos-vuelos", 0, 0, "MAD")
        cy.compruebaCelda("form-vuelos-vuelos", 0, 1, "BRC")
        cy.compruebaCelda("form-vuelos-vuelos", 0, 2, 180)
        cy.compruebaCelda("form-vuelos-vuelos", 0, 3, "15/08/2025, 10:00")
        cy.compruebaCelda("form-vuelos-vuelos", 0, 4, "15/08/2025, 11:30")
        cy.compruebaCelda("form-vuelos-vuelos", 0, 5, "NACIONAL")
        cy.compruebaCelda("form-vuelos-vuelos", 0, 6, "PROGRAMADO")
        
        cy.botonEvalua("be.disabled", "Reservar", "boton-reservar-vuelos")  

    })

    it('Comprobar que no salen pero el buscar vuelos si', () => {
        cy.intercept('GET', '**/public/vuelo*', { body: { content: [], totalElements: 0 } }).as('getVuelos')        
        cy.get('[data-cy="boton-buscar-aero"]').click()        
        cy.wait('@getVuelos')

        cy.comprueba("No hay vuelos disponibles, lamentamos las molestias.","msg-no-vuelos-buscar")
        
        cy.intercept('GET', '**/public/vuelo*', { fixture: 'vuelos.json' }).as('getVuelos')        

        cy.get('[data-cy="boton-buscar-vuelos"]').click()

        cy.compruebaCelda("form-vuelos-vuelos", 0, 0, "MAD")
        cy.compruebaCelda("form-vuelos-vuelos", 0, 1, "BRC")
        cy.compruebaCelda("form-vuelos-vuelos", 0, 2, 180)
        cy.compruebaCelda("form-vuelos-vuelos", 0, 3, "15/08/2025, 10:00")
        cy.compruebaCelda("form-vuelos-vuelos", 0, 4, "15/08/2025, 11:30")
        cy.compruebaCelda("form-vuelos-vuelos", 0, 5, "NACIONAL")
        cy.compruebaCelda("form-vuelos-vuelos", 0, 6, "PROGRAMADO")
       
        cy.evaluaNoExiste("msg-no-vuelos-buscar")
        
        cy.botonEvalua("be.disabled", "Reservar", "boton-reservar-vuelos")  
    })




})