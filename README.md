# Api 

## Funcional Description 
This is where the app's requests to interact with the database are handled.

## Technical Specs

### Enviroment Variables (.env)

- PORT: port of Api
- MONGODB_URL: address of mongodb
- JWT_SECRET: secret word('string') for jsonwebtoken

### Dependencies to be installed beforehand

- cors
- dotenv
- express
- jsonwebtoken
- mongoose

### Dependencies to be installed to make the test

- chai
- mocha
- nyc

### For install all

`npm install`

### To launch the API
- Install mongodb, open the console and place in the mongodb file  inside on mongodb carpet and execute: 

`./bin/mongod --dbpath data`

- Open the console and place in the mongosh file inside on mongodb carpet and execute:

`./bin/mongosh`

- Place in the api of Instaflan (~/instaflan-fullstack/api/) and execute: 

`node .`

### Test Coverage 
File                               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------------------|---------|----------|---------|---------|-------------------
All files                          |     100 |      100 |     100 |     100 | 
 data                              |     100 |      100 |     100 |     100 | 
  models.js                        |     100 |      100 |     100 |     100 | 
 logic/chats-logic                 |     100 |      100 |     100 |     100 | 
  createChat.js                    |     100 |      100 |     100 |     100 | 
  createChat.spec.js               |     100 |      100 |     100 |     100 | 
  deleteMessage.js                 |     100 |      100 |     100 |     100 | 
  deleteMessage.spec.js            |     100 |      100 |     100 |     100 | 
  editMessage.js                   |     100 |      100 |     100 |     100 | 
  editMessage.spec.js              |     100 |      100 |     100 |     100 | 
  numberChatsNotReading.js         |     100 |      100 |     100 |     100 |                   
  numberChatsNotReading.spec.js    |     100 |      100 |     100 |     100 | 
  retrieveChat.js                  |     100 |      100 |     100 |     100 | 
  retrieveChat.spec.js             |     100 |      100 |     100 |     100 | 
  retrieveChats.js                 |     100 |      100 |     100 |     100 | 
  retrieveChats.spec.js            |     100 |      100 |     100 |     100 |                   
  sendMessage.js                   |     100 |      100 |     100 |     100 | 
  sendMessage.spec.js              |     100 |      100 |     100 |     100 | 
 logic/commets-logic               |     100 |      100 |     100 |     100 | 
  createComment.js                 |     100 |      100 |     100 |     100 | 
  createComment.spec.js            |     100 |      100 |     100 |     100 | 
 logic/helpers                     |     100 |      100 |     100 |     100 |                   
  validators.js                    |     100 |      100 |     100 |     100 | 
 logic/notifications-logic         |     100 |      100 |     100 |     100 | 
  deleteAllNotifications.js        |     100 |      100 |     100 |     100 | 
  deleteAllNotifications.spec.js   |     100 |      100 |     100 |     100 | 
  deleteNotification.js            |     100 |      100 |     100 |     100 |                   
  deleteNotification.spec.js       |     100 |      100 |     100 |     100 | 
  retrieveNotifications.js         |     100 |      100 |     100 |     100 | 
  retrieveNotifications.spec.js    |     100 |      100 |     100 |     100 | 
 logic/post-logic                  |     100 |      100 |     100 |     100 | 
  createPost.js                    |     100 |      100 |     100 |     100 | 
  createPost.spec.js               |     100 |      100 |     100 |     100 | 
  deletePost.js                    |     100 |      100 |     100 |     100 | 
  deletePost.spec.js               |     100 |      100 |     100 |     100 | 
  editPost.js                      |     100 |      100 |     100 |     100 | 
  editPost.spec.js                 |     100 |      100 |     100 |     100 | 
  retrieveFavPosts.js              |     100 |      100 |     100 |     100 |                   
  retrieveFavPosts.spec.js         |     100 |      100 |     100 |     100 | 
  retrievePost.js                  |     100 |      100 |     100 |     100 | 
  retrievePost.spec.js             |     100 |      100 |     100 |     100 | 
  retrievePosts.js                 |     100 |      100 |     100 |     100 | 
  retrievePosts.spec.js            |     100 |      100 |     100 |     100 | 
  retrievePostsNotFollowed.js      |     100 |      100 |     100 |     100 | 
  retrievePostsNotFollowed.spec.js |     100 |      100 |     100 |     100 |                   
  retrievePostsOfUser.js           |     100 |      100 |     100 |     100 | 
  retrievePostsOfUser.spec.js      |     100 |      100 |     100 |     100 | 
  toggleFavPost.js                 |     100 |      100 |     100 |     100 | 
  toggleFavPost.spec.js            |     100 |      100 |     100 |     100 | 
 logic/user-logic                  |     100 |      100 |     100 |     100 | 
  authenticateUser.js              |     100 |      100 |     100 |     100 | 
  authenticateUser.spec.js         |     100 |      100 |     100 |     100 | 
  editUser.js                      |     100 |      100 |     100 |     100 | 
  editUser.spec.js                 |     100 |      100 |     100 |     100 | 
  registerUser.js                  |     100 |      100 |     100 |     100 | 
  registerUser.spec.js             |     100 |      100 |     100 |     100 | 
  retrieveFollowed.js              |     100 |      100 |     100 |     100 | 
  retrieveFollowed.spec.js         |     100 |      100 |     100 |     100 | 
  retrieveFollowing.js             |     100 |      100 |     100 |     100 | 
  retrieveFollowing.spec.js        |     100 |      100 |     100 |     100 | 
  retrieveUser.js                  |     100 |      100 |     100 |     100 | 
  retrieveUser.spec.js             |     100 |      100 |     100 |     100 | 
  retrieveUserById.js              |     100 |      100 |     100 |     100 | 
  retrieveUserById.spec.js         |     100 |      100 |     100 |     100 | 
  retrieveUsersNotFollowed.js      |     100 |      100 |     100 |     100 | 
  retrieveUsersNotFollowed.spec.js |     100 |      100 |     100 |     100 | 
  searchUser.js                    |     100 |      100 |     100 |     100 | 
  searchUser.spec.js               |     100 |      100 |     100 |     100 | 
  toggleFollowUser.js              |     100 |      100 |     100 |     100 | 
  toggleFollowUser.spec.js         |     100 |      100 |     100 |     100 | 

### Tested lines
- Data: 11/11
- Chats-logic: 381/381
- Comments-logic: 63/63
- Helpers: 34/34
- Notifications-logic: 175/175
- Posts-logic: 540/540
- User-logic: 549/549

Back [origin readme](../README.md)