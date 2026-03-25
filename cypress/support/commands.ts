/// <reference types="cypress" />
// ***********************************************
    export {}   //elimina todos los errores 
        //Exportamos algo vacio para que TS lo trate como modulo correctamente
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
 //Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
 //Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
 //Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
 //Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
 /*declare global {
   namespace Cypress {
     interface Chainable {
       login(email: string, password: string): Chainable<void>
       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
     }
   }
 }
*/
declare global {
  namespace Cypress {
    interface Chainable {
      MuestraAvion(): Chainable<JQuery<HTMLElement>>
      botonHome(): Chainable<JQuery<HTMLElement>>
      botonAbout(): Chainable<JQuery<HTMLElement>>
      botonProfile(): Chainable<JQuery<HTMLElement>>
      botonAeropuerto(): Chainable<JQuery<HTMLElement>>
      basicoFunciona(): Chainable<void>
      comprueba(texto: string, id: string): Chainable<JQuery<HTMLElement>>
      evaluaNoExiste(id: string): Chainable<JQuery<HTMLElement>>

      botonEvalua(accion: string, texto: string, id: string): Chainable<JQuery<HTMLElement>>
      inputEvalua(clase: string, placeholder: string, id: string, claseT: string): Chainable<JQuery<HTMLElement>>
      botonEvaluaPlus(texto:string, id:string, atributo:string, valorAtributo :string):Chainable<JQuery<HTMLElement>>
      evaluaDentroPadre(idPadre:string ,hijoT:string, hijoV:string, texto:string, claseBol:string, clase:string):Chainable<JQuery<HTMLElement>>
    
    }
  }
}

// Comando para saber que se muestra el Avion
Cypress.Commands.add('MuestraAvion', () => {
    cy.get('[data-cy="logo-avion"]').should('be.visible')
})

Cypress.Commands.add('botonHome', () => {
    cy.get('[data-cy="Home"]').should('be.visible')
    .click()
    cy.url().should('include','/')
    
})

Cypress.Commands.add('botonAbout', () => {
    cy.get('[data-cy="About"]').should('be.visible')
    .click()
    cy.url().should('include','/about')
})

Cypress.Commands.add('botonProfile', () => {
    cy.get('[data-cy="Profile"]').should('be.visible')
    .click()
    cy.url().should('include','/profile')
})

Cypress.Commands.add('botonAeropuerto', () => {
    cy.get('[data-cy="aeropuerto"]').should('be.visible')
    .click()
    cy.url().should('include','aeropuerto')
})


Cypress.Commands.add('basicoFunciona', () => {
    cy.MuestraAvion()
    cy.botonHome()
    cy.botonAbout()
        cy.botonProfile()
        cy.botonAeropuerto()
})


Cypress.Commands.add('comprueba', (texto, id) => {
    cy.get(`[data-cy="${id}"]`)
    .should('be.visible').and('contain', texto)
})

Cypress.Commands.add('evaluaNoExiste', (id) => {
    cy.get(`[data-cy="${id}"]`)
    .should("not.exist")
})

Cypress.Commands.add('botonEvalua', (accion, texto, id) => {
    cy.get(`[data-cy="${id}"]`)
    .and('contain', texto)
    .should(accion)
})

Cypress.Commands.add('inputEvalua', (clase, placeholder, id, claseT) => {
    cy.get(`[data-cy="${id}"]`)
    .should('have.attr', 'placeholder', placeholder) 
    .and(claseT, clase) //Para verificar si tiene el tipo de clase de prime vue
})

Cypress.Commands.add('botonEvaluaPlus', (texto, id, atributo, valorAtributo) => {
    cy.get(`[data-cy="${id}"]`)
    .should(valorAtributo, atributo)
})

//Funcion que evalua un onjeto padre que contiene un Input(hijoT) y un Label(hijoV) que se activaran
//segun sean porque texto es opcional y la clase a evaluar tambien.
Cypress.Commands.add('evaluaDentroPadre', (idPadre, hijoT, hijoV, texto, claseBol, clase) => {
    return cy.get(`[data-cy="${idPadre}"]`).within(() => {
        if(texto) cy.get(hijoT).should('contain', texto)
        if(clase) cy.get(hijoV).should(claseBol, clase)
    })
} )


