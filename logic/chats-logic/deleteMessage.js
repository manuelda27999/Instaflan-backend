const {Chat, User} = require("../../data/models")
const { validateId } = require("../helpers/validators")

function deleteMessage(userId, messageId) {
    validateId(userId)
    validateId(messageId)

    return Promise.all([User.findById(userId, '-__v').lean(), Chat.findOne({"messages._id": messageId},'-__v')])
    .then(([user, chat]) => {
        if(!user) throw new Error('user not found')
        if(!chat) throw new Error('chat not found')

        const indexMessage = chat.messages.findIndex(message => message._id.toString() === messageId)

        if (chat.messages[indexMessage].author.toString() !== userId) throw new Error('author of message and user are diferent')

        if (!chat.messages[indexMessage].delete) chat.messages[indexMessage].delete = false 
        if (chat.messages[indexMessage].delete === true) throw new Error('message already deleted')

        chat.messages[indexMessage].text = ''
        chat.messages[indexMessage].delete = true 

        return chat.save()
    })
}

module.exports = deleteMessage