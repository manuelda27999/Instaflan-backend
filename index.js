require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const {
  authenticateUser,
  createChat,
  createComment,
  createPost,
  deleteAllNotifications,
  deletePost,
  deleteMessage,
  deleteNotification,
  editMessage,
  editPost,
  editUser,
  numberChatsNotReading,
  registerUser,
  retrieveChat,
  retrieveChats,
  retrieveFavPosts,
  retrieveFollowed,
  retrieveFollowing,
  retrievePost,
  retrievePosts,
  retrievePostsOfUser,
  retrievePostsNotFollowed,
  retrieveNotifications,
  retrieveUser,
  retrieveUserById,
  retrieveUsersNotFollowed,
  searchUser,
  sendMessage,
  toggleFavPost,
  toggleFollowUser,
} = require("./logic/index");

const { MONGODB_URL, PORT, JWT_SECRET } = process.env;

mongoose.connect(`${MONGODB_URL}`).then(() => {
  const api = express();

  const jsonBodyParser = bodyParser.json();

  api.use(cors());

  api.post("/users/auth", jsonBodyParser, (req, res) => {
    try {
      const { email, password } = req.body;

      authenticateUser(email, password)
        .then((userId) => {
          const data = { sub: userId };

          const token = jwt.sign(data, JWT_SECRET);

          res.json(token);
        })
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.patch("/users/", jsonBodyParser, (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.slice(7);

    const data = jwt.verify(token, JWT_SECRET);
    const userId = data.sub;

    const { name, image, description } = req.body;

    try {
      editUser(userId, name, image, description)
        .then(() => res.status(200).send())
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.post("/users", jsonBodyParser, (req, res) => {
    try {
      const { name, email, password } = req.body;

      registerUser(name, email, password)
        .then(() => {
          res.status(201).send();
        })
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/users", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      retrieveUser(userId)
        .then((user) => res.json(user))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/users/:userIdProfile/followed", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { userIdProfile } = req.params;

      retrieveFollowed(userId, userIdProfile)
        .then((users) => res.json(users))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/users/:userIdProfile/following", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { userIdProfile } = req.params;

      retrieveFollowing(userId, userIdProfile)
        .then((users) => res.json(users))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/users/:userIdProfile", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { userIdProfile } = req.params;

      retrieveUserById(userId, userIdProfile)
        .then((user) => res.json(user))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/explorer/users", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      retrieveUsersNotFollowed(userId)
        .then((users) => res.json(users))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/search/:text", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { text } = req.params;

      searchUser(userId, text)
        .then((users) => res.json(users))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.put("/users/:userProfileId", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { userProfileId } = req.params;

      toggleFollowUser(userId, userProfileId)
        .then(() => res.status(200).json().send())
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.post("/posts", jsonBodyParser, (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { image, text } = req.body;

      createPost(userId, image, text)
        .then(() => {
          res.status(201).send();
        })
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.delete("/posts/:postId", jsonBodyParser, (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.slice(7);

    const data = jwt.verify(token, JWT_SECRET);
    const userId = data.sub;

    const { postId } = req.params;

    try {
      deletePost(userId, postId)
        .then(() => res.status(200).send())
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.patch("/posts/:postId", jsonBodyParser, (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.slice(7);

    const data = jwt.verify(token, JWT_SECRET);
    const userId = data.sub;

    const { image, text } = req.body;
    const { postId } = req.params;

    try {
      editPost(userId, postId, image, text)
        .then(() => res.status(200).send())
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/users/:userIdProfile/fav-posts", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { userIdProfile } = req.params;

      retrieveFavPosts(userId, userIdProfile)
        .then((post) => res.json(post))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/posts/:postId", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { postId } = req.params;

      retrievePost(userId, postId)
        .then((post) => res.json(post))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/posts", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      retrievePosts(userId)
        .then((posts) => res.json(posts))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/users/:userIdProfile/posts", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { userIdProfile } = req.params;

      retrievePostsOfUser(userId, userIdProfile)
        .then((posts) => res.json(posts))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/explorer/posts", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      retrievePostsNotFollowed(userId)
        .then((posts) => res.json(posts))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.put("/posts/:postId", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { postId } = req.params;

      toggleFavPost(userId, postId)
        .then(() => res.status(200).json().send())
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.post("/chats", jsonBodyParser, (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { otherUser } = req.body;

      createChat(userId, otherUser)
        .then((chatId) => {
          res.json(chatId);
        })
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.patch("/chats/:messageId", jsonBodyParser, (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.slice(7);

    const data = jwt.verify(token, JWT_SECRET);
    const userId = data.sub;

    const { text } = req.body;
    const { messageId } = req.params;

    try {
      editMessage(userId, messageId, text)
        .then(() => res.status(200).send())
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.put("/chats/:messageId", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { messageId } = req.params;

      deleteMessage(userId, messageId)
        .then(() => res.status(200).json().send())
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/chats/:chatId", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { chatId } = req.params;

      retrieveChat(userId, chatId)
        .then((chats) => res.json(chats))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/chats", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      retrieveChats(userId)
        .then((chats) => res.json(chats))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/chats-not-reading", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      numberChatsNotReading(userId)
        .then((number) => res.json(number))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.post("/chats/:chatId", jsonBodyParser, (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { chatId } = req.params;

      const { text } = req.body;

      sendMessage(userId, chatId, text)
        .then((chatId) => {
          res.json(chatId);
        })
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.post("/posts/:postId/comments", jsonBodyParser, (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      const { postId } = req.params;

      const { text } = req.body;

      createComment(userId, postId, text)
        .then(() => res.status(200).json().send())
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.delete("/notifications", jsonBodyParser, (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.slice(7);

    const data = jwt.verify(token, JWT_SECRET);
    const userId = data.sub;

    try {
      deleteAllNotifications(userId)
        .then(() => res.status(200).send())
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.delete("/notifications/:notificationId", jsonBodyParser, (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.slice(7);

    const data = jwt.verify(token, JWT_SECRET);
    const userId = data.sub;

    const { notificationId } = req.params;

    try {
      deleteNotification(userId, notificationId)
        .then(() => res.status(200).send())
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.get("/notifications", (req, res) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.slice(7);

      const data = jwt.verify(token, JWT_SECRET);
      const userId = data.sub;

      retrieveNotifications(userId)
        .then((notifications) => res.json(notifications))
        .catch((error) => res.status(400).json({ error: error.message }));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  api.listen(PORT, () => console.log("Servidor lanzado en puerto", PORT));
});
