
define('Test buscar pasajero profile', () => {

    beforeEach(()=>{
        cy.visit('/profile')
    })


    it('Test buscar pasajero con dni 47448089D en profile solo datos',()=>{
        cy.get('[data-cy="cuadro-texto-dni-profile"]').type("47448089D")
        cy.intercept('GET', '**/vuelo/pasajero*', { fixture: 'pasajero.json' }).as('getPasajero')
        
        cy.intercept('GET', '**/vuelo/reservas/pasajero*', {
            body: { content: [], totalElements: 0 } }).as('getReservas')

        cy.intercept('GET', '**/parking/pasajero*', {
            body: { content: [], totalElements: 0 }}).as('getParkings')

        cy.get('[data-cy="boton-buscar-profile"]').click()

        cy.wait('@getPasajero')

        cy.compruebaCelda("tabla-n-profile", 0,0, "Andrey").should('be.visible')
        cy.compruebaCelda("tabla-n-profile", 0,1, "Morales").should('be.visible')
        cy.compruebaCelda("tabla-n-profile", 0,2, "47448089D").should('be.visible')
        cy.compruebaCelda("tabla-n-profile", 0,3, "anmv@um.es").should('be.visible')
        cy.compruebaCelda("tabla-n-profile", 0,4, "ES").should('be.visible')

        cy.evaluaNoExiste("msg-info-profile")
        cy.evaluaNoExiste("boton-buscar-profile")

        cy.comprueba("Bienvenid@ Andrey","msg-bienv-profile")
        cy.comprueba("Volver","volver-profile")
        
        cy.evaluaNoExiste("tabla-r-profile")
        cy.evaluaNoExiste("tabla-p-profile")
    })


    it('Test buscar pasajero con dni 47448089D en profile datos pasajero y reservas',()=>{
        cy.get('[data-cy="cuadro-texto-dni-profile"]').type("47448089D")
        cy.intercept('GET', '**/vuelo/pasajero*', { fixture: 'pasajero.json' }).as('getPasajero')
        
        cy.intercept('GET', '**/vuelo/reservas/pasajero*', { fixture: 'reservas.json' }).as('getReservas')

        cy.intercept('GET', '**/parking/pasajero*', {
            body: { content: [], totalElements: 0 }}).as('getParkings')

        cy.get('[data-cy="boton-buscar-profile"]').click()

        cy.wait('@getPasajero')
        cy.wait('@getReservas')

        cy.compruebaCelda("tabla-r-profile", 0,0, "2025-03-22").should('be.visible')
        cy.compruebaCelda("tabla-r-profile", 0,1, "vuelo1").should('be.visible')
        cy.compruebaCelda("tabla-r-profile", 0,2, "BUSINESS").should('be.visible')
        
        cy.compruebaCelda("tabla-r-profile", 1,0, "2025-05-22").should('be.visible')
        cy.compruebaCelda("tabla-r-profile", 1,1, "vuelo2").should('be.visible')
        cy.compruebaCelda("tabla-r-profile", 1,2, "BUSINESS").should('be.visible')
        
        cy.evaluaNoExiste("msg-info-profile")
        cy.evaluaNoExiste("boton-buscar-profile")

        cy.comprueba("Bienvenid@ Andrey","msg-bienv-profile")
        cy.comprueba("Volver","volver-profile")

        cy.evaluaNoExiste("tabla-p-profile")
    })



    it('Test buscar pasajero con dni 47448089D en profile datos pasajero y parking',()=>{
        cy.get('[data-cy="cuadro-texto-dni-profile"]').type("47448089D")
        cy.intercept('GET', '**/vuelo/pasajero*', { fixture: 'pasajero.json' }).as('getPasajero')
        
        cy.intercept('GET', '**/vuelo/reservas/pasajero*', { body: { content: [], totalElements: 0 }}).as('getReservas')

        cy.intercept('GET', '**/parking/pasajero*', {
            fixture: 'parkings.json' }).as('getParkings')

        cy.get('[data-cy="boton-buscar-profile"]').click()

        cy.wait('@getPasajero')
        cy.wait('@getParkings')

        cy.compruebaCelda("tabla-p-profile", 0,0, "CORTO").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 0,1, "50000").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 0,2, "16/07/2025, 10:00").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 0,3, "16/08/2025, 09:00").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 0,4, "47448089D").should('be.visible')
        
        cy.compruebaCelda("tabla-p-profile", 1,0, "LARGO").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 1,1, "99999").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 1,2, "16/07/2026, 10:00").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 1,3, "16/08/2026, 09:00").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 1,4, "47448089D").should('be.visible')   

        cy.evaluaNoExiste("msg-info-profile")
        cy.evaluaNoExiste("boton-buscar-profile")

        cy.comprueba("Bienvenid@ Andrey","msg-bienv-profile")
        cy.comprueba("Volver","volver-profile")

        cy.evaluaNoExiste("tabla-r-profile")
    })



    it('Test buscar pasajero con dni 47448089D en profile datos pasajero, reservas y parking',()=>{
        cy.get('[data-cy="cuadro-texto-dni-profile"]').type("47448089D")
        cy.intercept('GET', '**/vuelo/pasajero*', { fixture: 'pasajero.json' }).as('getPasajero')
        
        cy.intercept('GET', '**/vuelo/reservas/pasajero*', { fixture: 'reservas.json' }).as('getReservas')

        cy.intercept('GET', '**/parking/pasajero*', {
            fixture: 'parkings.json' }).as('getParkings')

        cy.get('[data-cy="boton-buscar-profile"]').click()

        cy.wait('@getPasajero')
        cy.wait('@getParkings')
        cy.wait('@getReservas')

        cy.compruebaCelda("tabla-r-profile", 0,0, "2025-03-22").should('be.visible')
        cy.compruebaCelda("tabla-r-profile", 0,1, "vuelo1").should('be.visible')
        cy.compruebaCelda("tabla-r-profile", 0,2, "BUSINESS").should('be.visible')
        
        cy.compruebaCelda("tabla-r-profile", 1,0, "2025-05-22").should('be.visible')
        cy.compruebaCelda("tabla-r-profile", 1,1, "vuelo2").should('be.visible')
        cy.compruebaCelda("tabla-r-profile", 1,2, "BUSINESS").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 0,0, "CORTO").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 0,1, "50000").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 0,2, "16/07/2025, 10:00").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 0,3, "16/08/2025, 09:00").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 0,4, "47448089D").should('be.visible')
        
        cy.compruebaCelda("tabla-p-profile", 1,0, "LARGO").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 1,1, "99999").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 1,2, "16/07/2026, 10:00").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 1,3, "16/08/2026, 09:00").should('be.visible')
        cy.compruebaCelda("tabla-p-profile", 1,4, "47448089D").should('be.visible')   

        cy.evaluaNoExiste("msg-info-profile")
        cy.evaluaNoExiste("boton-buscar-profile")

        cy.comprueba("Bienvenid@ Andrey","msg-bienv-profile")
        cy.comprueba("Volver","volver-profile")
    })


    it('Regresar a profile sin datos',() => {
        cy.get('[data-cy="cuadro-texto-dni-profile"]').type("47448089D")
        cy.intercept('GET', '**/vuelo/pasajero*', { fixture: 'pasajero.json' }).as('getPasajero')
        
        cy.intercept('GET', '**/vuelo/reservas/pasajero*', { fixture: 'reservas.json' }).as('getReservas')

        cy.intercept('GET', '**/parking/pasajero*', {
            fixture: 'parkings.json' }).as('getParkings')

        cy.get('[data-cy="boton-buscar-profile"]').click()

        cy.wait('@getPasajero')
        cy.wait('@getParkings')
        cy.wait('@getReservas')
        
        cy.get('[data-cy="volver-profile"]').click()

        cy.evaluaNoExiste("msg-bienv-profile")
        cy.evaluaNoExiste("tabla-r-profile")
        cy.evaluaNoExiste("tabla-n-profile")
        cy.evaluaNoExiste("tabla-p-profile")
        cy.evaluaNoExiste("volver-profile")
        
        cy.comprueba("Para ver tu información introduce tu DNI.", "msg-info-profile")
        cy.comprueba("Registro", "boton-registro-profile")
        cy.botonEvalua("be.disabled", "Buscar", "boton-buscar-profile")  
        cy.inputEvalua("p-invalid", "DNI", "cuadro-texto-dni-profile", "have.class")

    })
    
})





