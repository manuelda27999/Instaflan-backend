require('dotenv').config()

const createChat = require('./createChat')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { expect } = require('chai')

describe('createChat', () => {
    before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

    let name
    let email
    let password
    let userId

    let name2
    let email2
    let password2
    let userId2

    beforeEach(() => {
        name = `name-${Math.random()}`
        email = `user-${Math.random()}@gmail.com`
        password = `pass-${Math.random()}`

        name2 = `name-${Math.random()}`
        email2 = `user-${Math.random()}@gmail.com`
        password2 = `pass-${Math.random()}`

        return Promise.all([User.create({ name, email, password }),
        User.create({ name: name2, email: email2, password: password2 })])
            .then(([user, user2]) => {
                userId = user.id
                userId2 = user2.id
            })
    })

    it('chat created correct', () =>
        createChat(userId, userId2)
            .then(chatId => expect(chatId).to.exist)
    )

    it('chat already exists correct', () =>
        createChat(userId, userId2)
            .then(() => createChat(userId, userId2))
            .then(chatId => expect(chatId).to.exist)
    )

    after(() => mongoose.disconnect())
})