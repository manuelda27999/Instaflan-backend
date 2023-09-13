require('dotenv').config()
const { mongoose } = require('mongoose')

const editPost = require('./editPost')
const { MONGODB_URL } = process.env

const { User, Post } = require('../../data/models')
const { expect } = require('chai')

describe('editPost', () => {
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

    let newText
    let newImage

    beforeEach(() => {
        name = `name-${Math.random()}`
        email = `user-${Math.random()}@gmail.com`
        password = `pass-${Math.random()}`

        name2 = `name-${Math.random()}`
        email2 = `user-${Math.random()}@gmail.com`
        password2 = `pass-${Math.random()}`

        text = `text-${Math.random()}`
        image = `https://${Math.random()}.jpg`

        newText = `text-${Math.random()}`
        newImage = `https://${Math.random()}.jpg`

        return Promise.all([User.create({ name, email, password }),
        User.create({ name: name2, email: email2, password: password2 })])
            .then(([user, user2]) => {
                userId = user.id
                userId2 = user2.id
                const likes = 0

                return Post.create({ author: user._id, image, text, likes })
            })
            .then(post => postId = post.id)
    })

    it('edit post correct', () =>
        editPost(userId, postId, newImage, newText)
            .then(() => {
                return Post.find({ author: userId }, '-__v')
            })
            .then(posts => {
                expect(posts[0].image).to.equal(newImage)
                expect(posts[0].text).to.equal(newText)
            })
    )

    it('fail for user not found', () =>
        editPost('123456123456123456123456', postId, image, text)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    it('fail for post not found', () =>
        editPost(userId, '123456123456123456123456', image, text)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('post not found')
            })
    )

    it('fail for post not found', () =>
        editPost(userId2, postId, image, text)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user and author of post is different')
            })
    )

    after(() => mongoose.disconnect())
})