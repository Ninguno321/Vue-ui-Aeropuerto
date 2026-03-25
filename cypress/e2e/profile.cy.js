

describe('Test de la pagina de Profile', () => {

    beforeEach(() => {
        cy.visit('/')
        cy.visit('/profile')
    })

    it('Todo lo basico funciona', () => {
        cy.basicoFunciona()
    })

    it('Muestra texto', ()=>{
        cy.comprueba("Para ver tu información introduce tu DNI.", "msg-info-profile")
    })

    it('Boton registrar', () => {
        cy.comprueba("Registro", "boton-registro-profile")
    })
    
    it('Boton buscar desactivado', () => {
        cy.botonEvalua("be.disabled", "Buscar", "boton-buscar-profile")  
    })
    
    it('Cuadro texto DNI invalido', () => {
        cy.inputEvalua("p-invalid", "DNI", "cuadro-texto-dni-profile", "have.class")
    })

    it('Cuadro texto DNI deja de ser invalido', () => {
        cy.get('[data-cy="cuadro-texto-dni-profile"]').type("47448089D")
        cy.inputEvalua("p-invalid", "DNI", "cuadro-texto-dni-profile", "not.have.class")
    })

    it('Boton Buscar deja de estar desactivado cuando hay texto', () => {
        cy.get('[data-cy="cuadro-texto-dni-profile"]').type("47448089D")
        cy.botonEvalua("not.be.disabled", "Buscar", "boton-buscar-profile")
    })


    it('Click en boton registrar muestra formulario con todo invalido y desactivado', () => {
        cy.comprueba("Registro", "boton-registro-profile")
        cy.get('[data-cy="boton-registro-profile"]').click()

        cy.botonEvalua("be.disabled", "Registrar", "boton-registrar-profile")
        cy.evaluaNoExiste("boton-registro-profile")
        cy.evaluaNoExiste("msg-info-profile")
        cy.evaluaNoExiste("boton-buscar-profile")

        cy.evaluaDentroPadre("form-n", "label", "input", "Nombre", "have.class", "p-invalid")
        cy.evaluaDentroPadre("form-a", "label", "input", "Apellidos", "have.class", "p-invalid")
        cy.evaluaDentroPadre("form-d", "label", "input", "DNI", "have.class", "p-invalid")
        cy.evaluaDentroPadre("form-e", "label", "input", "Email", "have.class", "p-invalid")
    })
    

    it('Rellenar formulario Nombre valida el campo', () => {
        cy.get('[data-cy="boton-registro-profile"]').click()
        cy.get('[data-cy="form-n"]').find('input').type("Andrey")
        cy.evaluaDentroPadre("form-n", "label", "input", "Nombre", "not.have.class", "p-invalid")
    })

    it('Rellenar formulario Apellidos valida el campo', () => {
        cy.get('[data-cy="boton-registro-profile"]').click()
        cy.get('[data-cy="form-a"]').find('input').type("Morales V")
        cy.evaluaDentroPadre("form-a", "label", "input", "Apellidos", "not.have.class", "p-invalid")
    })
     it('Rellenar formulario DNI valida el campo', () => {
        cy.get('[data-cy="boton-registro-profile"]').click()
        cy.get('[data-cy="form-d"]').find('input').type("47448089D")
        cy.evaluaDentroPadre("form-d", "label", "input", "DNI", "not.have.class", "p-invalid")
    })
     it('Rellenar formulario Email valida el campo', () => {
        cy.get('[data-cy="boton-registro-profile"]').click()
        cy.get('[data-cy="form-e"]').find('input').type("asantiago.morales@um.es")
        cy.evaluaDentroPadre("form-e", "label", "input", "Email", "not.have.class", "p-invalid")
    })

    it('Rellenar formulario Nacionalidad valida el campo', () => {
        cy.get('[data-cy="boton-registro-profile"]').click()
        cy.get('[data-cy="form-na"]').find('input').type("España")
        cy.evaluaDentroPadre("form-na", "label", "input", "Nacionalidad (Selecciona o escribe)", "not.have.class", "p-invalid")
    })

 
    it('Rellenar todo el formulario valida el boton de Registrar', () => {
        cy.get('[data-cy="boton-registro-profile"]').click()
        cy.get('[data-cy="form-n"]').find('input').type("Andrey")
        cy.get('[data-cy="form-a"]').find('input').type("Morales V")
        cy.get('[data-cy="form-d"]').find('input').type("47448089D")
        cy.get('[data-cy="form-e"]').find('input').type("asantiago.morales@um.es")
        cy.get('[data-cy="form-na"]').find('input').type("España")

        cy.botonEvalua("not.be.disabled", "Registrar", "boton-registrar-profile")
    })


})