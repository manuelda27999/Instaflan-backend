const { validateId } = require("../helpers/validators")
const { User } = require("../../data/models")

function deleteNotification(userId, notificationId) {
    validateId(userId)
    validateId(notificationId)

    return User.findById(userId, '-__v')
        .then(user => {
            if (!user) throw new Error('user not found')

            const index = user.notifications.findIndex(notification => notification._id.toString() === notificationId)

            if (index === -1) throw new Error('notification not found')
            else { user.notifications.splice(index, 1) }

            return user.save()
        })
        .then(() => { })
}

module.exports = deleteNotification