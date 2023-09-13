debugger
require('dotenv').config()
const { mongoose } = require('mongoose')

const retrieveNotifications = require('./retrieveNotifications')
const { MONGODB_URL } = process.env

const { User, Post } = require('../../data/models')
const { expect } = require('chai')

describe('retrieveNotifications', () => {
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
                Post.create({ author: user._id, image, text, likes, comments }),
                User.findById(userId2, '-__v'),
                User.findById(userId, '-__v')])
            })
            .then(([post, post2, user, user2]) => {
                postId = post.id

                const notification = {
                    text: 'Like',
                    user: user2._id,
                    post: post._id,
                    date: new Date()
                }

                const notification2 = {
                    text: 'Follow',
                    user: user2._id,
                    date: new Date()
                }

                const notification3 = {
                    text: 'Like',
                    user: user2._id,
                    post: post._id,
                    date: new Date()
                }

                user.notifications.push(notification, notification2, notification3)

                return user.save()
            })
            .then(() => {
                return User.findById(userId2, '-__v').lean()
            })
            .then(user => notificationId = user.notifications[0]._id.toString())
    })

    it('retrieve notifications correct', () =>
        retrieveNotifications(userId2)
            .then(notifications => expect(notifications.length).to.equal(3))
    )

    it('fail for user not found', () =>
        retrieveNotifications('123456123456123456123456')
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    after(() => mongoose.disconnect())
})