require('dotenv').config()
const {mongoose} = require('mongoose')
const sendMessage = require('./sendMessage')
const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
.then(()=> sendMessage('64be4f673d55f3b03ce22b11', '64ccb1f10c744c6c9b2e69d0', 'hello bro'))
.then(()=> console.log('message created'))
.catch(error => console.error(error))
.finally(() => mongoose.disconnect())