require('dotenv').config()

const searchUser = require('./searchUser')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { expect } = require('chai')

describe('searchUser', () => {
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
        searchUser(userId, 'n')
            .then(users => {
                expect(Array.isArray(users)).to.be.true;
            })
    )

    after(() => mongoose.disconnect())
})