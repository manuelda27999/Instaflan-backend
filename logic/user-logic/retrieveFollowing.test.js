require('dotenv').config()
const retrieveFollowing = require('./retrieveFollowing')
const mongoose = require('mongoose')
const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => retrieveFollowing('64c2a23b49d5974c2c044baf'))
    .then((following) => console.log(following))
    .catch(error => console.error(error))
    .finally(() => mongoose.disconnect())