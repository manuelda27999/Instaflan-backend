const { validateId } = require("../helpers/validators");
const { Chat } = require("../../data/models")

function numberChatsNotReading(userId) {
    validateId(userId)

    return Chat.find({ users: userId }, 'unreadFor').lean()
        .then((chats) => {

            let count = 0

            chats.forEach(chat => {
                if (chat.unreadFor.some(id => id.toString() === userId)) count++
            });

            return count
        })
}

module.exports = numberChatsNotReading