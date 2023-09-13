require('dotenv').config()

const mongoose = require('mongoose')
const authenticateUser = require('./authenticateUser')

const { User } = require('../../data/models')
const { expect } = require('chai')

const { MONGODB_URL } = process.env

describe('authenticateUser', () => {
    before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

    /* prepare scenario */

    let name
    let email
    let password
    let userId

    beforeEach(() => {
        name = `name-${Math.random()}`
        email = `user-${Math.random()}@gmail.com`
        password = `pass-${Math.random()}`

        return User.create({ name, email, password })
            .then(user => userId = user.id)
    })

    it('succeeds on correct credentials', () =>
        authenticateUser(email, password)
            .then(_userId => expect(_userId).to.equal(userId))
    )

    it('fails on user not found', () =>
        authenticateUser('aleatorio@gmail.com', password)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    it('fails on wrong password', () =>
        authenticateUser(email, password + 1)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('wrong credentials')
            })
    )

    it('fails on invalid email (email is not a string)', () => {
        try {
            return authenticateUser(12345, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('email is not a string')
        }
    })

    it('fails on invalid email (email is empty)', () => {
        try {
            return authenticateUser('', password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('email is empty')
        }
    })

    it('fails on invalid email (with no @)', () => {
        try {
            return authenticateUser('holamundo', password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('@ not found')
        }
    })

    it('fails on invalid email (@ is the first element)', () => {
        try {
            return authenticateUser(`@${email}`, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('@ is the first element')
        }
    })

    it('fails on invalid email (@ is the last element)', () => {
        try {
            return authenticateUser(`holamundo.com@`, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('email end with @')
        }
    })

    it('fails on invalid email (dot not found)', () => {
        try {
            return authenticateUser('holamundo@gmailcom', password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('dot not found')
        }
    })

    it('fails on invalid email (dot is the first element)', () => {
        try {
            return authenticateUser(`.holamundo@gmailcom`, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('dot is the first element')
        }
    })

    it('fails on invalid email (email end with dot)', () => {
        try {
            return authenticateUser(`holamundo@gmail.`, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('email end with dot')
        }
    })

    it('fails on invalid email (email must have at least 2 character after dot)', () => {
        try {
            return authenticateUser(`holamundo@gmail.c`, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('email must have at least 2 character after dot')
        }
    })

    it('fails on invalid email (dot is the next element from @)', () => {
        try {
            return authenticateUser(`holamundo@.com`, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('dot is the next element from @')
        }
    })

    it('fails on invalid email (incorrect character)', () => {
        try {
            return authenticateUser(`hola%mundo@gmail.com`, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('incorrect character %')
        }
    })

    it('fails on invalid email (incorrect character)', () => {
        try {
            return authenticateUser(`holamundo@gma%il.com`, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('incorrect character %')
        }
    })

    it('fails on invalid email (incorrect character)', () => {
        try {
            return authenticateUser(`holamundo@gmail.c%om`, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('incorrect character %')
        }
    })

    it('fails on invalid password (password is not a string)', () => {
        try {
            return authenticateUser(email, 1234)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('password is not a string')
        }
    })

    it('fails on invalid password (password is empty)', () => {
        try {
            return authenticateUser(email, '')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('password is empty')
        }
    })

    it('fails on invalid password (lower than 6 characters)', () => {
        try {
            return authenticateUser(email, '1234')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('password lenght should be bigger than 6')
        }
    })

    after(() => mongoose.disconnect())
})



