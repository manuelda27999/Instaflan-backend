const { User, Post } = require('../../data/models')
const { validateId } = require('../helpers/validators')

function retrievePosts(userId) {
    validateId(userId)

    return User.findById(userId).lean()
        .then(user => {
            if (!user) throw new Error('user not found')

            const followingUsers = user.following
            followingUsers.push(user._id)

            return Promise.all([User.findById(userId).lean(),
            Post.find({ author: followingUsers }, '-__v')
                .populate('author', 'name image')
                .populate({ path: 'comments.author', select: 'name image' })
                .sort({ date: -1 }).lean()])
        })
        .then(([user, posts]) => {

            posts.forEach(post => {
                post.id = post._id.toString()
                delete post._id

                if (post.author._id) {
                    post.author.id = post.author._id.toString()
                    delete post.author._id
                }

                const favPosts = user.favPosts.map((post) => {
                    return post.toString()
                })

                post.fav = favPosts.includes(post.id)

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

module.exports = retrievePosts