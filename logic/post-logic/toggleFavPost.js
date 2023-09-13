const { ObjectId } = require('mongodb');
const { User, Post } = require('../../data/models')
const { validateId } = require('../helpers/validators')

function toggleFavPost(userId, postId) {
    validateId(userId)
    validateId(postId)

    return Promise.all([User.findById(userId), Post.findById(postId)])
        .then(([user, post]) => {
            if (!user) throw new Error('user not found')
            if (!post) throw new Error('post not found')

            const favPosts = user.favPosts

            const index = favPosts.findIndex((id) => postId === id.toString())

            if (index === -1) {
                favPosts.push(post._id)
                post.likes++


                User.findById(post.author)
                    .then(user => {

                        if (userId !== user._id.toString()) {
                            const notification = {
                                text: 'Like',
                                user: userId,
                                post: new ObjectId(postId),
                                date: new Date()
                            }

                            user.notifications.push(notification)
                        }

                        return user.save()
                    })
                    .then(() => { })

            } else {
                favPosts.splice(index, 1)
                post.likes--
            }

            return Promise.all([user.save(), post.save()])
        })
        .then(() => { })
}

module.exports = toggleFavPost