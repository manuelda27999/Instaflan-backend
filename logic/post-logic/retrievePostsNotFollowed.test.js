require('dotenv').config()
const retrievePostsNotFollowed = require('./retrievePostsNotFollowed')
const {mongoose} = require('mongoose')

const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
 .then(() => retrievePostsNotFollowed('64c2a23b49d5974c2c044baf'))
 .then((posts)=> console.log(posts))
 .catch(error => console.error(error))
 .finally(()=> mongoose.disconnect())