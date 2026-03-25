//Contiene todos los test del grupo 'Pagina principal'
//Es como una carpeta que agrupa los test
describe('Pagina principal', () => {


    //Ejecuta el codigo ANTES de cada test indiviudual
    //Aqui preparamos el estado inicial de los test
    //Es como el GIVEN
    beforeEach(() => {
        cy.visit('/')   //Nos lleva a esta pagina, funciona porque en la configuracion hemos
                // Puesto la ruta  base. 'cypress.conftg.ts'
    })

    
    //Los test 
    //El nombre debe de ser exactamente lo que estamos comprobando 
    it('Informacion de vue, documentacion, tooling ...', () => {
        //Busca elementos en el DOM  usando selectores CSS [data].
        //Si no lo encuentra lo intenta drg 4 segs antes de fallar
        cy.get('[data-cy="titulos"]')    //Se tiene que declarar en el front como data-cy="titulo"
        //Es un assert, verifica que algo es cierto, en este caso, que sea visible
        .should('be.visible')
        //concetena otro assert sobre el mismo elemento
        //Contain veririfica que el elemento CONTIENE la cadena esa
        .and('contain', 'Documentation')
        cy.get('[data-cy="titulos"]').should('be.visible').and('contain', 'Tooling')
        cy.get('[data-cy="titulos"]').should('be.visible').and('contain', 'Ecosystem')
        cy.get('[data-cy="titulos"]').should('be.visible').and('contain', 'Community')
        cy.get('[data-cy="titulos"]').should('be.visible').and('contain', 'Support Vue')
        cy.get('[data-cy="icono"]').should('be.visible')
    
        cy.MuestraAvion()
    })

    
    it('Todos los botones de link funcionan', ()=> {
        cy.botonHome()
        cy.botonAbout()
        cy.botonProfile()
        cy.botonAeropuerto()
    })


    it('El boton de home me lleva la home', () => {
        cy.get('[data-cy="Home"]')
        //ANTES de hacer click berificamos que es visi
        // ble
        .should('be.visible')
        //Click tambien lo verifica pero con el shoud es mas legible
        //Simula un click del raton.
        /*
        Existe en el DOM 
        Es visible
        No esta deshabilitado
        No esta cubierto por otro elemento
        */
       //Si algo de eso falla nos avisa 
       //Despues del click la app navegara a /login 
        .click()
        //cy.url devuelve la url actual del navegador, el should con el include verifica que la url contenga la cadena
        cy.url().should('include','/')
        
    })


})