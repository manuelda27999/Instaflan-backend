require('dotenv').config()
const moongose = require('mongoose')
const retrieveChat = require('./retrieveChat')

const {MONGODB_URL} = process.env

moongose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => retrieveChat('64be4f673d55f3b03ce22b11', '64cb5997a1c6f21d9f1b2bc2'))
    .then(()=> console.log())
    .catch(error => console.error(error))
    .finally(()=> moongose.disconnect())