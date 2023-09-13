debugger
require('dotenv').config()
const { mongoose } = require('mongoose')

const retrievePostsNotFollowed = require('./retrievePostsNotFollowed')
const { MONGODB_URL } = process.env

const { User, Post } = require('../../data/models')
const { expect } = require('chai')

describe('retrievePostsNotFollowed', () => {
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

                return Promise.all([Post.create({ author: user2._id, image, text, likes, comments }),
                Post.create({ author: user2._id, image, text, likes, comments }),
                User.findById(userId, '-__v')
                ])
            })
            .then(([post, post2, user]) => {
                postId = post.id

                user.favPosts.push(post._id)

                return user.save()
            })
    })

    it('retrieve posts of not followed correct', () =>
        retrievePostsNotFollowed(userId)
            .then(posts => expect(posts.length).to.equal(4))
    )

    it('fail for user not found', () =>
        retrievePostsNotFollowed('123456123456123456123456')
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    after(() => mongoose.disconnect())
})