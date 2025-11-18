const { validateId, validateText } = require('../helpers/validators')
const { User } = require('../../data/models')

function searchUser(userId, text) {
    validateId(userId)
    validateText(text)

    const regex = new RegExp(`^${text}`, 'i')

    return User.find({ name: { $regex: regex } }, { name: 1, image: 1 }).lean()
        .then(users => {

            users.forEach(user => {
                user.id = user._id.toString()
                delete user._id
            })

            return users
        })
}

module.exports = searchUser