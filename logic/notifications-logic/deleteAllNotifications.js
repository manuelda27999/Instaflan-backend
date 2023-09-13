const { validateId } = require("../helpers/validators") 
const { User } = require("../../data/models")

function deleteAllNotifications(userId) {
    validateId(userId)

    return User.findById(userId, '-__v')
    .then(user => {
        if(!user) throw new Error('user not found')

       user.notifications = []

       user.save()
    })
    .then(() => { })
}

module.exports = deleteAllNotifications