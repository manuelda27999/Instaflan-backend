require('dotenv').config()
const retrieveFollowed = require('./retrieveFollowed')
const mongoose = require('mongoose')
const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => retrieveFollowed('64be4f673d55f3b03ce22b11'))
    .then((followed) => console.log(followed))
    .catch(error => console.error(error))
    .finally(() => mongoose.disconnect())