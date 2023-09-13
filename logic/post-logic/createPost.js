const { validateId, validateImage, validateText } = require('../helpers/validators')
const { User, Post } = require('../../data/models')

function createPost(userId, image, text) {
    validateId(userId)
    validateImage(image)
    validateText(text)

    return User.findById(userId)
        .then(user => {
            if (!user) throw new Error('user not found')

            const author = user._id
            const date = new Date()
            const likes = 0
            const comments = []

            return Post.create({ author, image, text, likes, date, comments })
        })
        .then(() => { })
}

module.exports = createPost