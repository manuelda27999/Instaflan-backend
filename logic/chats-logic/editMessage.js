const {Chat, User} = require("../../data/models")
const { validateId, validateText } = require("../helpers/validators")

function editMessage(userId, messageId, text) {
    validateId(userId)
    validateId(messageId)
    validateText(text)

    return Promise.all([User.findById(userId, '-__v').lean(), Chat.findOne({"messages._id": messageId},'-__v')])
    .then(([user, chat]) => {
        if(!user) throw new Error('user not found')
        if(!chat) throw new Error('chat not found')

        const indexMessage = chat.messages.findIndex(message => message._id.toString() === messageId)

        if (chat.messages[indexMessage].author.toString() !== userId) throw new Error('author of message and user are diferent')

        chat.messages[indexMessage].text = text
        chat.messages[indexMessage].edit = true 
        
        return chat.save()
    })
}

module.exports = editMessage