const { Chat, User } = require("../../data/models");
const { validateId, validateText } = require("../helpers/validators");

function sendMessage(userId, chatId, text) {
    validateId(userId)
    validateId(chatId)
    validateText(text)

    return Promise.all([Chat.findById(chatId, '-__v'), 
        User.findById(userId, '-__v').lean()])
        .then(([chat, user]) => {
            if (!chat) throw new Error('chat not found')
            if (!user) throw new Error('user not found')

            const message = {
                author: user._id,
                text: text,
                date: new Date(),
                edit: false,
                delete: false
            }

            chat.messages.push(message)

            chat.date = new Date()

            chat.unreadFor = chat.users
            const index = chat.unreadFor.findIndex(userId => userId.toString() === user._id.toString())
            chat.unreadFor.splice(index, 1)

            return chat.save()
        })
        .then(()=> { })
}

module.exports = sendMessage