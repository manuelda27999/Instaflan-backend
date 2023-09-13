const { User } = require('../../data/models')
const { validateId } = require('../helpers/validators')

function toggleFollowUser(userId, userIdProfile) {
    validateId(userId)
    validateId(userIdProfile)

    return Promise.all([User.findById(userId), User.findById(userIdProfile)])
        .then(([user, userProfile]) => {
            if (!user) throw new Error('user not found')
            if (!userProfile) throw new Error('userProfile not found')

            /* Modificar array de usuarios seguidos del usuario que realiza el follow */
            const followingUsers = user.following

            const index = followingUsers.findIndex((id) => userIdProfile === id.toString())

            if (index === -1) {
                followingUsers.push(userProfile._id)
            } else {
                followingUsers.splice(index, 1)
            }

            /* Modificar array de usuarios seguidores del usuario que ha sido seguido */
            const followedUsers = userProfile.followed

            const indexUser = followedUsers.findIndex((id) => userId === id.toString())

            if (indexUser === -1) {
                followedUsers.push(user._id)

                const notification = {
                    text: 'Follow',
                    user: user._id,
                    date: new Date()
                }

                userProfile.notifications.push(notification)
            } else {
                followedUsers.splice(indexUser, 1)
            }

            return Promise.all([user.save(), userProfile.save()])
        })
        .then(() => { })
}

module.exports = toggleFollowUser