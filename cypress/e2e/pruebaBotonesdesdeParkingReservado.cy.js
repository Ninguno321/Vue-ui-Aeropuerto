describe('Test botones de parking reservado', () => {
    
    beforeEach(()=>{
        cy.visit('/aeropuerto')
        cy.get('[data-cy="boton-reservar-aero"]').click()
        cy.url().should('contain','/reservaParking')

        cy.get('[data-cy="date-picker"]').click()
        
        cy.get('[aria-label="29"]').click()
        cy.get('[aria-label="29"]').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()

        cy.intercept('GET', '**/vuelo/pasajero*', { fixture: 'pasajero.json' }).as('getPasajero')
        
        cy.get('[data-cy="reservar-boton-parking"]').should('not.be.disabled').click()

        cy.get('[data-cy="form-card-n"]').find("input").type("Andrey")
        cy.get('[data-cy="form-card-a"]').find("input").type("Morales")
        cy.get('[data-cy="form-card-d"]').find("input").type("47448089D")
        cy.get('[data-cy="form-card-e"]').find("input").type("as@um.es")
        cy.get('[data-cy="form-card-na"]').find("input").type("Spain")


        cy.get('[data-cy="boton-conf-card-usu"]').click({ force: true });
        cy.wait('@getPasajero')


        cy.intercept('POST', '**/public/parking/reservar', {
        statusCode: 200,
        fixture: 'parkingAreservar.json'
        }).as('registro')
        cy.get('[data-cy="reservar-boton-parking"]').should('not.be.disabled').click()
    })


    it('prueba volver', () => {
        cy.get('[aria-label="Volver"]').click()
        cy.url().should('contain', '/aeropuerto')
    })

    
    it('prueba buscar vuelos', () => {
        cy.intercept('GET', '**/public/vuelo*', { fixture: 'vuelos.json' }).as('getVuelos')        
        cy.get('[data-cy="boton-reservar-vuelo-desde-parking"]').click()
        cy.url().should('contain', '/buscar/vuelos')
    })

    it('prueba ir a mi perfil', () => {
        cy.intercept('GET', '**/vuelo/pasajero*', { fixture: 'pasajero.json' }).as('getPasajero')
        cy.intercept('GET', '**/vuelo/reservas/pasajero*', { fixture: 'reservas.json' }).as('getReservas')

        cy.intercept('GET', '**/parking/pasajero*', {
            fixture: 'parkings.json' }).as('getParkings')
        cy.get('[data-cy="boton-irperfil-desde-parking"]').click()
        cy.url().should('contain', '/profile')
    })

})

