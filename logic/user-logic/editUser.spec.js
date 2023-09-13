require('dotenv').config()

const editUser = require('./editUser')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

const { User } = require('../../data/models')
const { expect } = require('chai')

describe('editUser', () => {
    before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

    let name
    let email
    let password
    let userId

    let newName

    beforeEach(() => {
        name = `name-${Math.random()}`
        email = `user-${Math.random()}@gmail.com`
        password = `pass-${Math.random()}`
        newName = `name-${Math.random()}`

        return User.create({ name, email, password })
            .then(user => userId = user.id)
    })

    it('succeeds on correct edited', () =>
        editUser(userId,
            newName,
            'https://www.mondosonoro.com/wp-content/uploads/2020/11/bad-bunny-promo.jpg',
            'Soy Roberto'
        )
            .then(() => User.findById(userId).lean())
            .then(user => {
                expect(user.name).to.equal(newName)
                expect(user.image).to.equal('https://www.mondosonoro.com/wp-content/uploads/2020/11/bad-bunny-promo.jpg')
                expect(user.description).to.equal('Soy Roberto')
            })
    )

    it('fails for user not found', () =>
        editUser('123456123456123456123456',
            newName,
            'https://www.mondosonoro.com/wp-content/uploads/2020/11/bad-bunny-promo.jpg',
            'Soy Roberto')
            .catch(error => {
                expect(error).to.be.instanceOf(Error)
                expect(error.message).to.equal('user not found')
            })
    )

    it('fails on invalid image (image is not a string)', () => {
        try {
            return editUser(userId,
                newName,
                1234,
                'Soy Roberto')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('image is not a string')
        }
    })

    it('fails on invalid image (image is empty)', () => {
        try {
            return editUser(userId,
                newName,
                '',
                'Soy Roberto')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('image is empty')
        }
    })

    it('fails on invalid image (image not start with http)', () => {
        try {
            return editUser(userId,
                newName,
                '//www.mondosonoro.com/wp-content/uploads/2020/11/bad-bunny-promo.jpg',
                'Soy Roberto')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('image not start with http')
        }
    })

    it('fails on invalid text (text is not a string)', () => {
        try {
            return editUser(userId,
                newName,
                'https://www.mondosonoro.com/wp-content/uploads/2020/11/bad-bunny-promo.jpg',
                12345)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('text is not a string')
        }
    })

    it('fails on invalid text (text is empty)', () => {
        try {
            return editUser(userId,
                newName,
                'https://www.mondosonoro.com/wp-content/uploads/2020/11/bad-bunny-promo.jpg',
                '')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('text is empty')
        }
    })

    it('fails on invalid id (id is not a string)', () => {
        try {
            return editUser(12345,
                newName,
                'https://www.mondosonoro.com/wp-content/uploads/2020/11/bad-bunny-promo.jpg',
                'Soy Roberto')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('id is not a string')
        }
    })

    it('fails on invalid id (id is empty)', () => {
        try {
            return editUser('',
                newName,
                'https://www.mondosonoro.com/wp-content/uploads/2020/11/bad-bunny-promo.jpg',
                'Soy Roberto')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('id is empty')
        }
    })

    after(() => mongoose.disconnect())
})