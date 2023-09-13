require('dotenv').config()

const retrieveUsersNotFollowed = require('./retrieveUsersNotFollowed')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { expect } = require('chai')

describe('retrieveUsersNotFollowed', () => {
    before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

    let name
    let email
    let password
    let userId
    let followed = []

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

        name2 = `name-${Math.random()}`
        email2 = `user-${Math.random()}@gmail.com`
        password2 = `pass-${Math.random()}`

        name3 = `name-${Math.random()}`
        email3 = `user-${Math.random()}@gmail.com`
        password3 = `pass-${Math.random()}`

        return Promise.all([
            User.create({ name, email, password, followed }),
            User.create({ name: name2, email: email2, password: password2 }),
            User.create({ name: name3, email: email3, password: password3 })
        ])
            .then(([user, user2, user3]) => {
                userId = user.id

                user.followed.push(user2.id)

                user.save()
            })
    })

    it('user retrieve correct', () =>
        Promise.all([retrieveUsersNotFollowed(userId),
        User.findById(userId, '-__v').lean()])
            .then(([users, user]) => {
                expect(users).to.not.include(user.followed)
            })
    )

    it('fail for user not found', () =>
        retrieveUsersNotFollowed('123456123456123456123456')
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    after(() => mongoose.disconnect())
})