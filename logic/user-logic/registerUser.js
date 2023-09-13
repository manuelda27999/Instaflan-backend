const { User } = require('../../data/models')
const { validateName, validateEmail, validatePassword } = require('../helpers/validators')

function registerUser(name, email, password) {
    validateName(name)
    validateEmail(email)
    validatePassword(password)

    return User.findOne({ email })
        .then(user => {
            if (user) throw new Error('user already exists')

            return User.create({ name, email, password })
        })
        .then(() => { })
}

module.exports = registerUser