require('dotenv').config()
const toggleFavPost = require('./toggleFavPost')
const mongoose = require('mongoose')
const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => toggleFavPost('64c2a23b49d5974c2c044baf', '64c2b2aeb07e1108fa6b856a'))
    .then(() => console.log('fav changed'))
    .catch(error => console.error(error))
    .finally(() => mongoose.disconnect())