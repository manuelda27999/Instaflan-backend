const { User, Post } = require('../../data/models')
const { validateId, validateImage, validateText } = require('../helpers/validators')

function editPost(userId, postId, image, text) {
    validateId(userId)
    validateId(postId)
    validateImage(image)
    validateText(text)

    return Promise.all([User.findById(userId).lean(), Post.findById(postId)])
        .then(([user, post]) => {
            if (!post) throw new Error('post not found')
            if (!user) throw new Error('user not found')

            if (post.author.toString() !== userId) throw new Error('user and author of post is different')

            post.image = image
            post.text = text

            return post.save()
        })
        .then(() => { })
}

module.exports = editPost