const { validateId } = require('../helpers/validators')
const { User } = require('../../data/models')

function retrieveUser(userId, userIdProfile) {
    validateId(userId)
    validateId(userIdProfile)

    return Promise.all([User.findById(userId, 'following -_id').lean(),
    User.findById(userIdProfile, 'name email image description followed following').lean()])
        .then(([user, userProfile]) => {
            if (!user) throw new Error('user not found')
            if (!userProfile) throw new Error('userProfile not found')

            const usersFollowing = user.following.map((user) => user.toString());

            userProfile.follow = usersFollowing.includes(userProfile._id.toString())

            delete userIdProfile._id

            return userProfile
        })
}

module.exports = retrieveUser