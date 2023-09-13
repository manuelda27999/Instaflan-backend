require('dotenv').config()
const moongose = require('mongoose')
const retrieveChats = require('./retrieveChats')

const {MONGODB_URL} = process.env

moongose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => retrieveChats('64be4f673d55f3b03ce22b11'))
    .then((chats)=> console.log(chats))
    .catch(error => console.error(error))
    .finally(()=> moongose.disconnect())