describe('Test comprieba los botones tras registro', () => {

    beforeEach(()=>{
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
    })


    it('Volver', () => {
        cy.get('[data-cy="btn-volver-resvuelo"]').click()
        cy.url().should('contain', '/buscar/vuelos')
    })



    it('Ir a mi perfil', () => {
        cy.get('[data-cy="btn-profile-resvuelo"]').click()
        cy.url().should('contain', '/profile')
    })

    
    it('Reservar Parking', () => {
        cy.get('[data-cy="btn-reservarParking-resvuelo"]').click()
        cy.url().should('contain', '/reservaParking')
    })




})