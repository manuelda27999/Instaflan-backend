const { Chat } = require("../../data/models");
const { validateId } = require("../helpers/validators");

function retrieveChats(userId) {
  validateId(userId);

  return Chat.find({ users: userId }, "-__v")
    .populate("users", "name image")
    .sort({ date: -1 })
    .lean()
    .then((chats) => {
      chats.forEach((chat) => {
        chat.id = chat._id;
        delete chat._id;

        const index = chat.users.findIndex((user) => {
          const rawId = user?._id ?? user?.id;

          if (!rawId) return false;

          const normalizedId =
            typeof rawId === "string" ? rawId : rawId.toString();

          return normalizedId === userId;
        });

        if (index >= 0) {
          chat.users.splice(index, 1);
        }

        chat.users.forEach((user) => {
          const rawId = user?._id ?? user?.id;

          if (rawId) {
            user.id = typeof rawId === "string" ? rawId : rawId.toString();
          }

          if (user._id) delete user._id;
        });

        chat.messages.forEach((message) => {
          const rawMessageId = message?._id ?? message?.id;

          if (rawMessageId) {
            message.id =
              typeof rawMessageId === "string"
                ? rawMessageId
                : rawMessageId.toString();
          }

          if (message._id) delete message._id;
        });
      });

      return chats;
    });
}

module.exports = retrieveChats;
