require('dotenv').config()
const retrieveUsersNotFollowed = require('./retrieveUsersNotFollowed')
const mongoose = require('mongoose')
const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => retrieveUsersNotFollowed('64c2a23b49d5974c2c044baf'))
    .then((users) => console.log(users))
    .catch(error => console.error(error))
    .finally(() => mongoose.disconnect())