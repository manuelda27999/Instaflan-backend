require('dotenv').config()

const sendMessage = require('./sendMessage')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { Chat } = require('../../data/models')
const { expect } = require('chai')

describe('sendMessage', () => {
    before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

    let name
    let email
    let password
    let userId

    let name2
    let email2
    let password2
    let userId2

    let text
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

                return Chat.create({ users, messages, date })
            })
            .then(chat => chatId = chat._id.toString())
    })

    it('send message correct', () =>
        sendMessage(userId, chatId, text)
            .then(() => {
                return Chat.findById(chatId, '-__v').lean()
            })
            .then(chat => {
                expect(chat.messages.length).to.equal(1)
            })
    )

    it('fail for user not found', () =>
        sendMessage('123456123456123456123456', chatId, text)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    it('fail for chat not found', () =>
        sendMessage(userId, '123456123456123456123456', text)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('chat not found')
            })
    )

    after(() => mongoose.disconnect())
})