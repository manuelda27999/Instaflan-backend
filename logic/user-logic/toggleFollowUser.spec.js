require('dotenv').config()

const toggleFollowUser = require('./toggleFollowUser')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { expect } = require('chai')

describe('toggleFollowUser', () => {
    before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

    let name
    let email
    let password
    let userId

    let name2
    let email2
    let password2
    let userId2

    beforeEach(() => {
        name = `name-${Math.random()}`
        email = `user-${Math.random()}@gmail.com`
        password = `pass-${Math.random()}`

        name2 = `name-${Math.random()}`
        email2 = `user-${Math.random()}@gmail.com`
        password2 = `pass-${Math.random()}`

        return Promise.all([User.create({ name, email, password }),
        User.create({ name: name2, email: email2, password: password2 })])
            .then(([user, user2]) => {
                userId = user.id
                userId2 = user2.id

                user.following.push(user2._id)
                user2.followed.push(user._id)

                return Promise.all([user.save(), user2.save()])
            })
    })

    it('users retrieve correct', () =>
        toggleFollowUser(userId, userId2)
            .then(() => {

                return Promise.all([User.findById(userId, '-__v').lean(),
                User.findById(userId2, '-__v').lean()])
            })
            .then(([user, user2]) => {

                expect(user.following.includes(user2._id.toString())).to.be.false
            })
    )

    it('users retrieve correct', () =>
        toggleFollowUser(userId2, userId)
            .then(() => {

                return Promise.all([User.findById(userId, '-__v').lean(),
                User.findById(userId2, '-__v').lean()])
            })
            .then(([user, user2]) => {
                const following = []

                user.following.forEach(user => {
                    following.push(user.toString())
                });

                expect(following.includes(user2._id.toString())).to.be.true
            })
    )

    it('fail for user not found', () =>
        toggleFollowUser('123456123456123456123456', userId)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    it('fail for user not found', () =>
        toggleFollowUser(userId, '123456123456123456123456')
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('userProfile not found')
            })
    )

    after(() => mongoose.disconnect())
})