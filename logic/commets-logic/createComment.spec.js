require('dotenv').config()
const { mongoose } = require('mongoose')

const createComment = require('./createComment')
const { MONGODB_URL } = process.env

const { User, Post } = require('../../data/models')
const { expect } = require('chai')

describe('createComment', () => {
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

                return Post.create({ author: user._id, image, text, likes, comments })
            })
            .then(post => {
                postId = post.id
            })
    })

    it('create comment correct', () =>
        createComment(userId, postId, text)
            .then(() => {
                return Post.find({ author: userId }, '-__v')
            })
            .then(posts => expect(posts[0].comments.length).to.equal(3))
    )

    it('create comment correct', () =>
        createComment(userId2, postId, text)
            .then(() => {
                return Post.find({ author: userId }, '-__v')
            })
            .then(posts => expect(posts[0].comments.length).to.equal(3))
    )

    it('fail for user not found', () =>
        createComment('123456123456123456123456', postId, text)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    it('fail for post not found', () =>
        createComment(userId, '123456123456123456123456', text)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('post not found')
            })
    )

    after(() => mongoose.disconnect())
})