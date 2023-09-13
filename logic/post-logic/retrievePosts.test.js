require('dotenv').config()
const retrievePosts = require('./retrievePosts')
const { mongoose } = require('mongoose')

const { MONGODB_URL } = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => retrievePosts('64c2a23b49d5974c2c044baf'))
    .then((posts) => console.log(posts))
    .catch(error => console.error(error))
    .finally(() => mongoose.disconnect())