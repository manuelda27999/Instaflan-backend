const {validateId} = require('../helpers/validators')
const {User} = require('../../data/models')

function retrieveUser(userId) {
    validateId(userId)

    return User.findById(userId, 'name email image description following followed -_id').lean()
        .then(user => {
            if(!user) throw new Error('user not found')

            return user
        })
}

module.exports = retrieveUser