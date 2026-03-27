describe('Test para registrar a un NUEVO pasajero', () => {


    beforeEach(()=>{
        cy.visit('/profile')
    })

    it('Registro con datos incorrectos', () => {
        cy.get('[data-cy="boton-registro-profile"]').click()
        cy.get('[data-cy="form-n"]').find('input').type("Andrey 2")
        cy.get('[data-cy="form-a"]').find('input').type("Morales 2")
        cy.get('[data-cy="form-d"]').find('input').type("49215450G")
        cy.get('[data-cy="form-e"]').find('input').type("anmv@um.es 2")
        cy.get('[data-cy="form-na"]').find('input').type("ES 2")
        
        cy.get('[data-cy="boton-registrar-profile"]').click()

        cy.comprueba("Datos incorrectos 🚨","datos-err-profile")
    })





    it('Registro con datos correctos ', () => {
        cy.get('[data-cy="boton-registro-profile"]').click()
        cy.get('[data-cy="form-n"]').find('input').type("Andrey 2")
        cy.get('[data-cy="form-a"]').find('input').type("Morales 2")
        cy.get('[data-cy="form-d"]').find('input').type("49215450G")
        cy.get('[data-cy="form-e"]').find('input').type("anmv@um.es 2")
        cy.get('[data-cy="form-na"]').find('input').type("ES 2")
      
        cy.intercept('POST', '**/vuelo/registrar/pasajero', {
            statusCode: 200, body: { success: true } }).as('registro')

        cy.get('[data-cy="boton-registrar-profile"]').click()

        cy.wait('@registro').then((intercepcion) => {       
            expect(intercepcion.request.body.dni).to.equal('49215450G')
            expect(intercepcion.request.body.nombre).to.equal('Andrey 2')
            expect(intercepcion.request.body.email).to.equal('anmv@um.es 2')
        })


        cy.intercept('GET', '**/vuelo/pasajero*', { fixture: 'pasajeroRegistro.json' }).as('getPasajero')
        cy.intercept('GET', '**/vuelo/reservas/pasajero*', {
            body: { content: [], totalElements: 0 } }).as('getReservas')

        cy.intercept('GET', '**/parking/pasajero*', {
            body: { content: [], totalElements: 0 }}).as('getParkings')

        cy.wait('@getPasajero')

        cy.compruebaCelda("tabla-n-profile", 0,0, "Andrey 2").should('be.visible')
        cy.compruebaCelda("tabla-n-profile", 0,1, "Morales 2").should('be.visible')
        cy.compruebaCelda("tabla-n-profile", 0,2, "49215450G").should('be.visible')
        cy.compruebaCelda("tabla-n-profile", 0,3, "anmv@um.es 2").should('be.visible')
        cy.compruebaCelda("tabla-n-profile", 0,4, "ES 2").should('be.visible')

        cy.evaluaNoExiste("msg-info-profile")
        cy.evaluaNoExiste("boton-buscar-profile")

        cy.comprueba("Bienvenid@ Andrey 2","msg-bienv-profile")
        cy.comprueba("Volver","volver-profile")
        
        cy.evaluaNoExiste("tabla-r-profile")
        cy.evaluaNoExiste("tabla-p-profile")

    })



})