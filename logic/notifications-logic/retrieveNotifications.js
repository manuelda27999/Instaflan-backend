const { validateId } = require("../helpers/validators");
const { User } = require("./../../data/models")

function retrieveNotifications(userId) {
    validateId(userId)

    return User.findById(userId, 'notifications -_id')
        .populate({ path: 'notifications.user', select: 'name image' })
        .populate({ path: 'notifications.post', select: 'text image' })
        .sort({ date: -1 }).lean()
        .then(user => {
            if (!user) throw new Error('user not found')

            user.notifications.forEach(notification => {

                if (notification.user._id) {
                    notification.user.id = notification.user._id.toString()
                    delete notification.user._id
                }

                if (notification.post) {
                    if (notification.post._id) {
                        notification.post.id = notification.post._id.toString()
                        delete notification.post._id
                    }
                }

                notification.id = notification._id.toString()
                delete notification._id
                delete notification.date
            })

            return user.notifications.reverse()
        })
}

module.exports = retrieveNotifications