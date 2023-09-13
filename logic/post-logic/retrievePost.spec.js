require('dotenv').config()
const { mongoose } = require('mongoose')

const retrievePost = require('./retrievePost')
const { MONGODB_URL } = process.env

const { User, Post } = require('../../data/models')
const { expect } = require('chai')

describe('retrievePost', () => {
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

                return Promise.all([Post.create({ author: user._id, image, text, likes, comments }),
                User.findById(userId, '-__v')])
            })
            .then(([post, user]) => {
                postId = post.id

                user.favPosts.push(post._id)

                return user.save()
            })
    })

    it('retrieve post correct', () =>
        retrievePost(userId, postId)
            .then(post => {
                expect(post.text).to.equal(text)
                expect(post.image).to.equal(image)
            })
    )

    it('fail for user not found', () =>
        retrievePost('123456123456123456123456', postId)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    it('fail for post not found', () =>
        retrievePost(userId, '123456123456123456123456')
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('post not found')
            })
    )

    it('fail for author and user different', () =>
        retrievePost(userId2, postId)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user and author of post is different')
            })
    )

    after(() => mongoose.disconnect())
})