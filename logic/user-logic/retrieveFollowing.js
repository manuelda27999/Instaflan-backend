const { User } = require("../../data/models");
const { validateId } = require("../helpers/validators");

function retrieveFolling(userId ,userIdProfile) {
    validateId(userId)
    validateId(userIdProfile)

    return Promise.all([User.findById(userId, '-__v').lean(), User.findById(userIdProfile, '-__v').populate('following', 'name image').lean()])
    .then(([user, userProfile]) => {
        if(!user) throw new Error('user not found')
        if(!userProfile) throw new Error('userProfile not found')

        const following = userProfile.following

        following.forEach(userProfile => {
            userProfile.id = userProfile._id.toString()
            delete userProfile._id

            userProfile.follow = true
        });

        return following
    })
}

module.exports = retrieveFolling