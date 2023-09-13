const { User, Post } = require('../../data/models')
const { validateId } = require('../helpers/validators')

function retrieveFavPosts(userId, userIdProfile) {
    validateId(userId)
    validateId(userIdProfile)

    return Promise.all([User.findById(userId).lean(), User.findById(userIdProfile).lean()])
        .then(([user, userProfile]) => {
            if (!user) throw new Error('user not found')
            if (!userProfile) throw new Error('user not found')

            const favPosts = userProfile.favPosts

            return Post.find({ _id: favPosts }, '-__v')
                .populate('author', 'name image')
                .populate({ path: 'comments.author', select: 'name image' })
                .sort({ date: -1 }).lean()
        })
        .then((posts) => {
            posts.forEach(post => {
                post.id = post._id.toString()
                delete post._id

                if (post.author._id) {
                    post.author.id = post.author._id.toString()
                    delete post.author._id
                }

                post.fav = true

                post.comments.forEach(comment => {
                    comment.id = comment._id.toString()
                    delete comment._id

                    if (comment.author._id) {
                        comment.author.id = comment.author._id
                        delete comment.author._id
                    }
                })
            })

            return posts
        })
}

module.exports = retrieveFavPosts