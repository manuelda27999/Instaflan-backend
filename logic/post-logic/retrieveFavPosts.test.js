require('dotenv').config()
const retrieveFavPosts = require('./retrieveFavPosts')
const {mongoose} = require('mongoose')

const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
 .then(() => retrieveFavPosts('64c2a23b49d5974c2c044baf', '64c2a23b49d5974c2c044baf'))
 .then((posts)=> console.log(posts))
 .catch(error => console.error(error))
 .finally(()=> mongoose.disconnect())