const { User } = require("../../data/models");
const { validateId } = require("../helpers/validators");

function retrieveUsersNotFollowed(userId) {
    validateId(userId)

    User.findById(userId).lean()
    .then(user => {
        if(!user) throw new Error('user not found')

        const usersFollowed = user.following ? user.following : []
        usersFollowed.push(user._id)

        return User.find({ _id: { $nin: usersFollowed } }, 'name image').lean()
        .then(users => {
            if(!users) throw new Error('users not found')


            const usersIdClean = users.map(user => ({
                ...user,
                _id: user._id.toString()
              }));
              
            return usersIdClean
        })
    })
}

module.exports = retrieveUsersNotFollowed