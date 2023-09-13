require('dotenv').config()
const retrievePostsOfUser = require('./retrievePostsOfUser')
const {mongoose} = require('mongoose')

const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
 .then(() => retrievePostsOfUser('64be4f673d55f3b03ce22b11', '64c2a23b49d5974c2c044baf'))
 .then((posts)=> console.log(posts))
 .catch(error => console.error(error))
 .finally(()=> mongoose.disconnect())