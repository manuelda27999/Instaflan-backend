require('dotenv').config()
const toggleFollowUser = require('./toggleFollowUser')
const mongoose = require('mongoose')
const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => toggleFollowUser('64c2a23b49d5974c2c044baf', '64be4f673d55f3b03ce22b11'))
    .then(() => console.log('user followed'))
    .catch(error => console.error(error))
    .finally(() => mongoose.disconnect())