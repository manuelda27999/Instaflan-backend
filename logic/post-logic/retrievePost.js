const { validateId } = require('../helpers/validators')
const { User, Post } = require('../../data/models')

function retrievePost(userId, postId) {
    validateId(userId)
    validateId(postId)

    return Promise.all([User.findById(userId).lean(), Post.findById(postId, '-likes -date -__v').lean()])
        .then(([user, post]) => {
            if (!post) throw new Error('post not found')
            if (!user) throw new Error('user not found')

            if (post.author.toString() !== userId) throw new Error('user and author of post is different')

            delete post.author
            delete post._id

            return post
        })
}

module.exports = retrievePost