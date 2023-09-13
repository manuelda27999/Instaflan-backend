require('dotenv').config()

const retrieveFollowing = require('./retrieveFollowing')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { expect } = require('chai')

describe('retrieveFollowing', () => {
    before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

    let name
    let email
    let password
    let following
    let userId

    let name2
    let email2
    let password2

    let name3
    let email3
    let password3


    beforeEach(() => {
        name = `name-${Math.random()}`
        email = `user-${Math.random()}@gmail.com`
        password = `pass-${Math.random()}`
        following = []
        followingResult = []

        name2 = `name-${Math.random()}`
        email2 = `user-${Math.random()}@gmail.com`
        password2 = `pass-${Math.random()}`

        name3 = `name-${Math.random()}`
        email3 = `user-${Math.random()}@gmail.com`
        password3 = `pass-${Math.random()}`

        return Promise.all([
            User.create({ name, email, password, following }),
            User.create({ name: name2, email: email2, password: password2 }),
            User.create({ name: name3, email: email3, password: password3 })
        ])
            .then(([user, user2, user3]) => {
                userId = user.id
                user.following.push(user2.id)
                user.following.push(user3.id)

                return user.save()
            })
    })

    it('return correct the following', () =>
        retrieveFollowing(userId, userId)
            .then(followingUser => {
                expect(followingUser).to.be.an('array').that.satisfy(array => {
                    return array.every(user => typeof user === 'object')
                })
            })
    )

    it('fails for user not found', () =>
        retrieveFollowing('123456123456123456123456', userId)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    it('fails for other user not found', () =>
        retrieveFollowing(userId, '123456123456123456123456')
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('userProfile not found')
            })
    )


    after(() => mongoose.disconnect())
})