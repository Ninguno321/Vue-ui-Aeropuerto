describe('Tests para la reserva de un vuelo', () => {

    beforeEach(()=>{
        cy.visit('/aeropuerto')
        cy.intercept('GET', '**/public/vuelo*', { fixture: 'vuelosSinReserva.json' }).as('getVuelos')        
        cy.get('[data-cy="boton-buscar-aero"]').click()        
        cy.wait('@getVuelos')
    })


    it('Comprueba boton Reservar no disabled cuando se selecciona un vuelo', () => {
       
        //Hace click en la primera fila
        cy.get('[data-cy="form-vuelos-vuelos"]').find('tbody tr').eq(0).click()
        cy.botonEvalua("not.be.disabled", "Reservar", "boton-reservar-vuelos")  
    })


    it('click en reservar sin pasajero abre menu form con todo ', () => {
        //Hace click en la primera fila
        cy.get('[data-cy="form-vuelos-vuelos"]').find('tbody tr').eq(0).click()
        cy.get('[data-cy="boton-reservar-vuelos"]').click()  

        cy.get('[data-cy="card-from-usu"]').should('be.visible')

        cy.evaluaDentroPadre("form-card-n", "label", "input", "Nombre", "have.class", "p-invalid")
        cy.evaluaDentroPadre("form-card-d", "label", "input", "DNI", "have.class", "p-invalid") 
        cy.evaluaDentroPadre("form-card-e", "label", "input", "Email", "have.class", "p-invalid") 
        cy.evaluaDentroPadre("form-card-a", "label", "input", "Apellidos", "have.class", "p-invalid") 
        cy.evaluaDentroPadre("form-card-na", "label", "input", "Nacionalidad", "have.class", "p-invalid") 
    


        cy.comprueba("Cancel", "boton-cancel-card-usu")
        cy.comprueba("Confirmar", "boton-conf-card-usu")
        cy.botonEvalua("be.disabled","Confirmar", "boton-conf-card-usu")   
    })

    it('Cerrar cierra', () => {
        cy.get('[data-cy="form-vuelos-vuelos"]').find('tbody tr').eq(0).click()
        cy.get('[data-cy="boton-reservar-vuelos"]').click()  
        cy.get('[data-cy="boton-cancel-card-usu"]').click()
        cy.evaluaNoExiste("card-from-usu")
    })


    it('Confirmar confirma estando ya registrado mediante buscar', () => {

        cy.visit('/aeropuerto')
        cy.intercept('GET', '**/public/vuelo*', { fixture: 'vuelos.json' }).as('getVuelos')        
        cy.get('[data-cy="boton-buscar-aero"]').click()        
        cy.wait('@getVuelos')


        cy.visit('/profile')
        cy.get('[data-cy="cuadro-texto-dni-profile"]').type("47448089D")
        cy.intercept('GET', '**/vuelo/pasajero*', { fixture: 'pasajero.json' }).as('getPasajero')
        cy.intercept('GET', '**/vuelo/reservas/pasajero*', {
            body: { content: [], totalElements: 0 } }).as('getReservas')
        cy.intercept('GET', '**/parking/pasajero*', {
            body: { content: [], totalElements: 0 }}).as('getParkings')
        cy.get('[data-cy="boton-buscar-profile"]').click()
        cy.wait('@getPasajero')

        cy.visit('/aeropuerto')
        cy.intercept('GET', '**/public/vuelo*', { fixture: 'vuelos.json' }).as('getVuelos')        
        cy.get('[data-cy="boton-buscar-aero"]').click()        
        cy.wait('@getVuelos')

        cy.get('[data-cy="form-vuelos-vuelos"]').find('tbody tr').eq(0).click()
        cy.get('[data-cy="boton-reservar-vuelos"]').click()  

        
    })


    it('Confirmar confirma rellenando datos', () => {

        cy.get('[data-cy="form-vuelos-vuelos"]').find('tbody tr').eq(0).click()
        cy.get('[data-cy="boton-reservar-vuelos"]').click()  

        cy.intercept('GET', '**/vuelo/pasajero*', { fixture: 'pasajero.json' }).as('getPasajero')
        

        cy.get('[data-cy="card-from-usu"]').should('be.visible')

        cy.get('[data-cy="form-card-n"]').find("input").type("Andrey")
        cy.get('[data-cy="form-card-a"]').find("input").type("Morales")
        cy.get('[data-cy="form-card-d"]').find("input").type("47448089D")
        cy.get('[data-cy="form-card-e"]').find("input").type("as@um.es")
        cy.get('[data-cy="form-card-na"]').find("input").type("Spain")


        cy.get('[data-cy="boton-conf-card-usu"]').click({ force: true });
        cy.wait('@getPasajero')

        cy.url().should('contain', '/reservar/Vuelo3Programado')

        cy.get('[data-cy="Mensaje-reserva-conf"]').should('be.visible')
        
        cy.get('[data-cy="btn-volver-resvuelo"]').should('not.exist')
        cy.get('[data-cy="btn-profile-resvuelo"]').should('not.exist')
  
         
        cy.get('[data-cy="boton-masinfo-res"]').click()
        
        cy.get('[data-cy="btn-cancelar-inforreservavuelo"]').should('be.visible')
        cy.get('[data-cy="btn-confirmar-inforreservavuelo"]').should('be.disabled')
        cy.get('[data-cy="select-asiento-card"]').click().get('#pv_id_112_0').click()

        cy.intercept('POST', '**/public/vuelo/reservar', {
        statusCode: 200,
        fixture: 'vueloAreservar.json'
        }).as('registro')

        cy.get('[data-cy="btn-confirmar-inforreservavuelo"]').should('not.be.disabled').click()


        cy.get('[data-cy="btn-volver-resvuelo"]').should('be.visible')
        cy.get('[data-cy="btn-profile-resvuelo"]').should('be.visible')

    })



})
