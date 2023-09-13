const { Chat, User } = require("../../data/models");
const { validateId } = require("../helpers/validators");

function retrieveChat(userId, chatId) {
    validateId(userId)
    validateId(chatId)

    return Promise.all([Chat.findById(chatId, '-__v'), User.findById(userId, '-__v').lean()])
        .then(([chat, user]) => {
            if (!chat) throw new Error('chat not found')
            if (!user) throw new Error('user not found')

            const index = chat.unreadFor.findIndex(userId => userId.toString() === user._id.toString())
            if (index > -1) {
                chat.unreadFor.splice(index, 1)
            }

            return chat.save()
        })
        .then(() => {
            return Chat.findById(chatId, '-__v')
                .populate('users', 'name image').sort({ date: -1 }).lean()
        })
        .then(chat => {

            chat.id = chat._id.toString()
            delete chat._id

            const index = chat.users.findIndex(user => user._id.toString() === userId)
            chat.users.splice(index, 1)

            chat.users.forEach(user => {
                user.id = user._id
                delete user._id
            })

            chat.messages.forEach(message => {
                message.id = message._id.toString()
                delete message._id
            })

            return chat
        })
}

module.exports = retrieveChat