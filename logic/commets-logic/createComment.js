const { ObjectId } = require('mongodb');
const { validateId, validateText } = require("../helpers/validators")
const { User, Post } = require("../../data/models")

function createComment(userId, postId, text) {
    validateId(userId)
    validateId(postId)
    validateText(text)

    return Promise.all([Post.findById(postId, '-__v'),
    User.findById(userId, '-__v')])
        .then(([post, user]) => {
            if (!post) throw new Error('post not found')
            if (!user) throw new Error('user not found')

            const comment = {
                author: user._id,
                text: text,
                date: new Date()
            }

            post.comments.push(comment)

            User.findById(post.author)
                .then(user => {
                    if (userId !== user._id.toString()) {
                        const notification = {
                            text: 'Comment',
                            user: userId,
                            post: new ObjectId(postId),
                            date: new Date()
                        }

                        user.notifications.push(notification)
                    }

                    return user.save()
                })
                .then(() => { })

            return post.save()
        })
        .then(() => { })
}

module.exports = createComment