require('dotenv').config()
const {mongoose} = require('mongoose')
const editMessage = require('./editMessage')
const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
.then(()=> editMessage('64be4f673d55f3b03ce22b11', '64cccd54360f915f1ab88a73', 'hello loko'))
.then((chat)=> console.log(chat))
.catch(error => console.error(error))
.finally(() => mongoose.disconnect())