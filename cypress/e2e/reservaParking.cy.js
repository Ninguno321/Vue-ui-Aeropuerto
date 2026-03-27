describe('Test comprieba los botones tras registro', () => {

    it('Reservar Parking desde botones de reserva ', () => {
        cy.visit('/aeropuerto')
        cy.intercept('GET', '**/public/vuelo*', { fixture: 'vuelosSinReserva.json' }).as('getVuelos')        
        cy.get('[data-cy="boton-buscar-aero"]').click()        
        cy.wait('@getVuelos')

                cy.get('[data-cy="form-vuelos-vuelos"]').find('tbody tr').eq(0).click()
        cy.get('[data-cy="boton-reservar-vuelos"]').click()  

        cy.intercept('GET', '**/vuelo/pasajero*', { fixture: 'pasajero.json' }).as('getPasajero')
        
        cy.get('[data-cy="form-card-n"]').find("input").type("Andrey")
        cy.get('[data-cy="form-card-a"]').find("input").type("Morales")
        cy.get('[data-cy="form-card-d"]').find("input").type("47448089D")
        cy.get('[data-cy="form-card-e"]').find("input").type("as@um.es")
        cy.get('[data-cy="form-card-na"]').find("input").type("Spain")


        cy.get('[data-cy="boton-conf-card-usu"]').click({ force: true });
        cy.wait('@getPasajero')

        cy.url().should('contain', '/reservar/Vuelo3Programado')

         
        cy.get('[data-cy="boton-masinfo-res"]').click()
        
        cy.get('[data-cy="select-asiento-card"]').click().get('#pv_id_112_0').click()

        cy.intercept('POST', '**/public/vuelo/reservar', {
        statusCode: 200,
        fixture: 'vueloAreservar.json'
        }).as('registro')

        cy.get('[data-cy="btn-confirmar-inforreservavuelo"]').click()

        cy.get('[data-cy="btn-reservarParking-resvuelo"]').click()

        cy.get('[data-cy="date-picker"]').click()
        
        cy.get('[aria-label="29"]').click()
        cy.get('[aria-label="29"]').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        
        cy.intercept('POST', '**/public/parking/reservar', {
        statusCode: 200,
        fixture: 'parkingAreservar.json'
        }).as('registro')

        cy.get('[data-cy="reservar-boton-parking"]').should('not.be.disabled').click()
        cy.get('[data-cy="gracias"]').should('be.visible')
        cy.get('[data-cy="boton-irperfil-desde-parking"]').should('be.visible')
        cy.get('[data-cy="boton-reservar-vuelo-desde-parking"]').should('be.visible')


    })
    
    it('Reserva parking desde aeropuerto', () => {
        cy.visit('/aeropuerto')
        cy.get('[data-cy="boton-reservar-aero"]').click()
        cy.url().should('contain','/reservaParking')

        
        cy.get('[data-cy="reservar-boton-parking"]').should('be.disabled')
        cy.get('[data-cy="date-picker"]').should('have.class', 'p-invalid')
        cy.get('[data-cy="date-picker"]').click()
        
        cy.get('[aria-label="29"]').click()
        cy.get('[aria-label="29"]').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
        cy.get('.p-datepicker-minute-picker > .p-datepicker-increment-button').click()
         
        cy.get('[data-cy="date-picker"]').should('not.have.class', 'p-invalid')


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
        cy.get('[data-cy="gracias"]').should('be.visible')
        cy.get('[data-cy="boton-irperfil-desde-parking"]').should('be.visible')
        cy.get('[data-cy="boton-reservar-vuelo-desde-parking"]').should('be.visible')
    })

})