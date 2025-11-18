const { User } = require('../../data/models')
const { validateId, validateName, validateImage: validateImage, validateText } = require('../helpers/validators')

function editUser(userId, name, image, description) {
    validateId(userId)
    validateName(name)
    validateImage(image)
    validateText(description)

    return User.findById(userId)
        .then(user => {
            if (!user) throw new Error('user not found')

            user.name = name
            user.image = image
            user.description = description

            return user.save()
        })
        .then(() => { })
}

module.exports = editUser