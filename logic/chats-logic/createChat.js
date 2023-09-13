const { Chat } = require("../../data/models");
const { validateId } = require("../helpers/validators");
const { ObjectId } = require('mongodb')

function createChat(userId, otherUser) {
    validateId(userId)
    validateId(userId)

    const users = [new ObjectId(userId), new ObjectId(otherUser)]

    return Chat.findOne({users: users}, '-__v')
        .then(chat => {

            if(chat) {

                return chat.id
            } else {
                const date = new Date()

                const messages = []

                return Chat.create({users, messages, date})
                .then(chat => {
                    
                    return chat.id
                })
        }
    })
}

module.exports = createChat