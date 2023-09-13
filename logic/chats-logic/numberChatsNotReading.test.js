require('dotenv').config()
const moongose = require('mongoose')
const numberChatsNotReading = require('./numberChatsNotReading')

const {MONGODB_URL} = process.env

moongose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => numberChatsNotReading('64c2a23b49d5974c2c044baf'))
    .then((number)=> console.log(number))
    .catch(error => console.error(error))
    .finally(()=> moongose.disconnect())