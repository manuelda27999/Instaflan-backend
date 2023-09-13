require('dotenv').config()

const numberChatsNotReading = require('./numberChatsNotReading')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { Chat } = require('../../data/models')
const { expect } = require('chai')

describe('numberChatsNotReading', () => {
    before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

    let name
    let email
    let password
    let userId

    let name2
    let email2
    let password2
    let userId2

    let chatId

    beforeEach(() => {
        name = `name-${Math.random()}`
        email = `user-${Math.random()}@gmail.com`
        password = `pass-${Math.random()}`

        name2 = `name-${Math.random()}`
        email2 = `user-${Math.random()}@gmail.com`
        password2 = `pass-${Math.random()}`

        text = `test-${Math.random()}`

        return Promise.all([User.create({ name, email, password }),
        User.create({ name: name2, email: email2, password: password2 })])
            .then(([user, user2]) => {
                userId = user.id
                userId2 = user2.id

                const date = new Date()
                const messages = []
                const users = [user._id, user2._id]
                const unreadFor = [user._id]

                return Promise.all([Chat.create({ users, messages, date, unreadFor }),
                Chat.create({ users, messages, date })])
            })
    })

    it('retrieve number of chats not reading correct', () =>
        numberChatsNotReading(userId)
            .then(count => {
                expect(count).to.be.equal(1)
            })
    )

    after(() => mongoose.disconnect())
})