require('dotenv').config()

const retrieveUserById = require('./retrieveUserById')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { expect } = require('chai')

describe('retrieveUserById', () => {
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

                return user.save()
            })
    })

    it('user retrieve correct', () =>
        retrieveUserById(userId, userId)
            .then(user => {
                expect(user.name).to.equal(name)
                expect(user.email).to.equal(email)
            })
    )

    it('fail for user not found', () =>
        retrieveUserById('123456123456123456123456', userId)
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    it('fail for other user not found', () =>
        retrieveUserById(userId, '123456123456123456123456')
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('userProfile not found')
            })
    )

    after(() => mongoose.disconnect())
})
