require('dotenv').config()
const {mongoose} = require('mongoose')
const deleteMessage = require('./deleteMessage')
const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
.then(()=> deleteMessage('64be4f673d55f3b03ce22b11', '64cccd71931f0bcbf1f2b08b'))
.then((chat)=> console.log(chat))
.catch(error => console.error(error))
.finally(() => mongoose.disconnect())