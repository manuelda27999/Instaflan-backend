debugger
require('dotenv').config()

const editMessage = require('./editMessage')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { Chat } = require('../../data/models')
const { expect } = require('chai')

describe('editMessage', () => {
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
    let messageId
    let newText

    beforeEach(() => {
        name = `name-${Math.random()}`
        email = `user-${Math.random()}@gmail.com`
        password = `pass-${Math.random()}`

        name2 = `name-${Math.random()}`
        email2 = `user-${Math.random()}@gmail.com`
        password2 = `pass-${Math.random()}`

        text = `test-${Math.random()}`
        newText = `test-${Math.random()}`

        return Promise.all([User.create({ name, email, password }),
        User.create({ name: name2, email: email2, password: password2 })])
            .then(([user, user2]) => {
                userId = user.id
                userId2 = user2.id

                const date = new Date()
                const messages = []
                const users = [user._id, user2._id]

                const message = {
                    author: user._id,
                    text: text,
                    date: new Date(),
                    edit: false,
                    delete: false
                }

                messages.push(message)

                return Chat.create({ users, messages, date })
            })
            .then(chat => {
                chatId = chat.id
                return Chat.findById(chatId, '-__v').lean()
            })
            .then(chat => {
                messageId = chat.messages[0]._id.toString()
            })
    })

    it('edit message correct', () =>
        editMessage(userId, messageId, newText)
            .then(() => {
                return Chat.findById(chatId, '-__v').lean()
            })
            .then(chat => {
                expect(chat.messages[0].text).to.equal(newText)
            })
    )

    it('fails for user not found', () =>
        editMessage('123456123456123456123456', messageId, newText)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    it('fails for chat not found', () =>
        editMessage(userId, '123456123456123456123456', newText)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('chat not found')
            })
    )

    it('fails for message author is different of user', () =>
        editMessage(userId2, messageId, newText)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('author of message and user are diferent')
            })
    )

    after(() => mongoose.disconnect())
})