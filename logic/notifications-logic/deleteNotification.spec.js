debugger
require('dotenv').config()
const { mongoose } = require('mongoose')

const deleteNotification = require('./deleteNotification')
const { MONGODB_URL } = process.env

const { User, Post } = require('../../data/models')
const { expect } = require('chai')

describe('deleteNotification', () => {
    before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

    /* prepare scenario */

    let name
    let email
    let password
    let userId

    let name2
    let email2
    let password2
    let userId2

    let text
    let image
    let postId

    let notificationId
    let notificationId2

    beforeEach(() => {
        name = `name-${Math.random()}`
        email = `user-${Math.random()}@gmail.com`
        password = `pass-${Math.random()}`

        name2 = `name-${Math.random()}`
        email2 = `user-${Math.random()}@gmail.com`
        password2 = `pass-${Math.random()}`

        text = `text-${Math.random()}`
        image = `https://${Math.random()}.jpg`

        return Promise.all([User.create({ name, email, password }),
        User.create({ name: name2, email: email2, password: password2 })])
            .then(([user, user2]) => {
                userId = user.id
                userId2 = user2.id
                const likes = 0

                const comments = []
                const comment = {
                    author: user._id,
                    text: text,
                    date: new Date()
                }

                comments.push(comment)

                const comment2 = {
                    author: user._id,
                    text: text,
                    date: new Date()
                }

                comments.push(comment2)

                return Promise.all([Post.create({ author: user._id, image, text, likes, comments }),
                User.findById(userId, '-__v'),
                User.findById(userId2, '-__v')])
            })
            .then(([post, user, user2]) => {
                postId = post.id

                const notification = {
                    text: 'Like',
                    user: user2._id,
                    post: post._id,
                    date: new Date()
                }

                const notification2 = {
                    text: 'Like',
                    user: user2._id,
                    post: post._id,
                    date: new Date()
                }

                user.notifications.push(notification)
                user.notifications.push(notification2)

                return user.save()
            })
            .then(() => {
                return User.findById(userId, '-__v').lean()
            })
            .then(user => {
                notificationId = user.notifications[0]._id.toString()
                notificationId2 = user.notifications[1]._id.toString()
            })
    })

    it('delete notification correct', () =>
        deleteNotification(userId, notificationId)
            .then(() => {
                return User.findById(userId, '-__v').lean()
            })
            .then(user => {
                expect(user.notifications.length).to.equal(1)
            })
    )

    it('delete notification correct', () =>
        deleteNotification(userId, notificationId2)
            .then(() => {
                return User.findById(userId, '-__v').lean()
            })
            .then(user => expect(user.notifications.length).to.equal(1))
    )

    it('fail for user not found', () =>
        deleteNotification('123456123456123456123456', notificationId)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    it('fail for notifications not found', () =>
        deleteNotification(userId, '123456123456123456123456')
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('notification not found')
            })
    )

    after(() => mongoose.disconnect())
})