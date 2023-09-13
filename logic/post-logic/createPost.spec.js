debugger
require('dotenv').config()
const { mongoose } = require('mongoose')

const createPost = require('./createPost')
const { MONGODB_URL } = process.env

const { User, Post } = require('../../data/models')
const { expect } = require('chai')

describe('createPost', () => {
   before(() => mongoose.connect(`${MONGODB_URL}/instaflan-test`))

   /* prepare scenario */

   let name
   let email
   let password
   let userId

   let text
   let image

   beforeEach(() => {
      name = `name-${Math.random()}`
      email = `user-${Math.random()}@gmail.com`
      password = `pass-${Math.random()}`
      text = `text-${Math.random()}`
      image = `https://${Math.random()}.jpg`

      return User.create({ name, email, password })
         .then(user => userId = user.id)
   })

   it('create post correct', () =>
      createPost(userId, image, text)
         .then(() => {
            return Post.find({ author: userId }, '-__v')
         })
         .then(posts => expect(posts.length).to.equal(1))
   )

   it('fail for user not found', () =>
      createPost('123456123456123456123456', image, text)
         .catch(error => {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('user not found')
         })
   )

   after(() => mongoose.disconnect())
})