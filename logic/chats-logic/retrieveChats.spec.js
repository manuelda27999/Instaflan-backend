require('dotenv').config()

const retrieveChats = require('./retrieveChats')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { Chat } = require('../../data/models')
const { expect } = require('chai')

describe('retrieveChats', () => {
    before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

    let name
    let email
    let password
    let userId

    let name2
    let email2
    let password2
    let userId2

    let name3
    let email3
    let password3
    let userId3

    beforeEach(() => {
        name = `name-${Math.random()}`
        email = `user-${Math.random()}@gmail.com`
        password = `pass-${Math.random()}`

        name2 = `name-${Math.random()}`
        email2 = `user-${Math.random()}@gmail.com`
        password2 = `pass-${Math.random()}`

        name3 = `name-${Math.random()}`
        email3 = `user-${Math.random()}@gmail.com`
        password3 = `pass-${Math.random()}`

        text = `test-${Math.random()}`

        return Promise.all([User.create({ name, email, password }),
        User.create({ name: name2, email: email2, password: password2 }),
        User.create({ name: name3, email: email3, password: password3 })])
            .then(([user, user2, user3]) => {
                userId = user.id
                userId2 = user2.id
                userId3 = user3.id

                const date = new Date()
                const messages = []
                const users = [user._id, user2._id]
                const users2 = [user._id, user3._id]

                const message = {
                    author: user._id,
                    text: text,
                    date: new Date(),
                    edit: false,
                    delete: false
                }

                messages.push(message)

                return Promise.all([Chat.create({ users, messages, date }),
                Chat.create({ users: users2, messages, date })])
            })
    })

    it('retrieve chats correct', () =>
        retrieveChats(userId)
            .then(chats => {
                expect(chats.length).to.equal(2)
            })
    )

    after(() => mongoose.disconnect())
})