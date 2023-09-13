require('dotenv').config()
const {mongoose} = require('mongoose')
const createChat = require('./createChat')
const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
.then(()=> createChat('64be4f673d55f3b03ce22b11', ["64c2a23b49d5974c2c044baf"]))
.then((chatId)=> console.log(chatId))
.catch(error => console.error(error))
.finally(() => mongoose.disconnect())