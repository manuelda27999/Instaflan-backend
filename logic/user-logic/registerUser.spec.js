require('dotenv').config()
const { mongoose } = require('mongoose')

const registerUser = require('./registerUser')
const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { expect } = require('chai')

describe('registerUser', () => {
    before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

    /* prepare scenario */

    let name
    let email
    let password

    beforeEach(() => {
        name = `name-${Math.random()}`
        email = `user-${Math.random()}@gmail.com`
        password = `pass-${Math.random()}`
    })

    it('succeeds on correct credentials', () =>
        registerUser(name, email, password)
            .then(() => User.findOne({ email }).lean())
            .then(user => {
                expect(user.name).to.equal(name)
                expect(user.email).to.equal(email)
                expect(user.password).to.equal(password)
            })
    )

    it('fails for user already exit', () =>
        registerUser(name, email, password)
            .then(() => {
                return registerUser(name, email, password)
                    .catch(error => {
                        expect(error).to.be.instanceOf(Error)
                        expect(error.message).to.equal('user already exists')
                    })
            })
    )

    it('fails on invalid email (email is not a string)', () => {
        try {
            return registerUser(name, 12345, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('email is not a string')
        }
    })

    it('fails on invalid name (name is empty)', () => {
        try {
            return registerUser('', email, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('name is empty')
        }
    })

    it('fails on invalid name (name is not a string)', () => {
        try {
            return registerUser(1234, email, password)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('name is not a string')
        }
    })

    after(() => mongoose.disconnect())
})

