/// <reference types="cypress" />

describe('Testes da Funcionalidade Usuários', () => {
    let token

    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    })

    it('Deve validar contrato de usuários', () => {
        cy.request('usuarios').then(response => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            expect(response.body.usuarios[0]).to.have.all.keys('_id', 'nome', 'email', 'password', 'administrador')
        })
    })

    it('Deve listar usuários cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'usuarios'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            expect(response.duration).to.be.lessThan(50)
        })
    })

    it('Deve cadastrar um usuário com sucesso', () => {
        let email = `usuario_${Math.floor(Math.random() * 100000)}@qa.com`
        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": "Usuário EBAC",
                "email": email,
                "password": "teste",
                "administrador": "true"
            }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    })

    it('Deve validar um usuário com email inválido', () => {
        cy.request({
            method: 'POST',
            url: 'usuarios',
            failOnStatusCode: false,
            body: {
                "nome": "Usuário Inválido",
                "email": "emailinvalido",
                "password": "teste",
                "administrador": "false"
            }
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.email).to.equal('email deve ser um email válido')
        })
    })

    it('Deve editar um usuário previamente cadastrado', () => {
        let email = `usuario_edit_${Math.floor(Math.random() * 100000)}@qa.com`

        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": "Usuário Editável",
                "email": email,
                "password": "teste",
                "administrador": "true"
            }
        }).then(response => {
            const id = response.body._id

            cy.request({
                method: 'PUT',
                url: `usuarios/${id}`,
                body: {
                    "nome": "Usuário Editado",
                    "email": email,
                    "password": "novaSenha",
                    "administrador": "false"
                }
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    })

    it('Deve deletar um usuário previamente cadastrado', () => {
        let email = `usuario_del_${Math.floor(Math.random() * 100000)}@qa.com`

        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": "Usuário Deletável",
                "email": email,
                "password": "teste",
                "administrador": "true"
            }
        }).then(response => {
            const id = response.body._id

            cy.request({
                method: 'DELETE',
                url: `usuarios/${id}`
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
        })
    })
})

