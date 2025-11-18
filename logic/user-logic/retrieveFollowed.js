const { User } = require("../../data/models");
const { validateId } = require("../helpers/validators");

function retrieveFollowed(userId, userIdProfile) {
    validateId(userId)
    validateId(userIdProfile)

    return Promise.all([User.findById(userId, '-__v').lean(),
        User.findById(userIdProfile, '-__v').populate('followed', 'name image').lean()]) 
    .then(([user, userProfile]) => {
        if(!user) throw new Error('user not found')
        if(!userProfile) throw new Error('userProfile not found')

        const followed = userProfile.followed

        followed.forEach(userProfile => {
            userProfile.id = userProfile._id.toString()
            delete userProfile._id
        });

        return followed
    })
}

module.exports = retrieveFollowed