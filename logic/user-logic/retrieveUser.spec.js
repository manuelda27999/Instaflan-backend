require('dotenv').config()

const retrieveUser = require('./retrieveUser')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { expect } = require('chai')

describe('retrieveUser', () => {
    before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

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

    it('user retrieve correct', () =>
        retrieveUser(userId)
            .then(user => {
                expect(user.name).to.equal(name)
                expect(user.email).to.equal(email)
            })
    )

    it('fail for user not found', () =>
        retrieveUser('123456123456123456123456')
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    after(() => mongoose.disconnect())
})