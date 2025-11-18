const { User } = require("../../data/models");
const { validateId } = require("../helpers/validators");

function retrieveUsersNotFollowed(userId) {
  validateId(userId)

  return User.findById(userId).lean()
    .then(user => {
      if (!user) throw new Error('user not found')

      const usersFollowed = user.following
      usersFollowed.push(user._id)

      return User.aggregate([
        {
          $match: {
            _id: { $nin: usersFollowed }
          }
        },
        {
          $sample: { size: 4 }
        },
        {
          $project: {
            id: { $toString: "$_id" },
            name: 1,
            image: 1
          }
        }
      ])
    })
    .then(users => {

      users.forEach(user => {
        delete user._id
      })

      return users
    })
}

module.exports = retrieveUsersNotFollowed