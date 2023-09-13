require('dotenv').config()
const moongose = require('mongoose')
const retrievePost = require('./retrievePost')

const {MONGODB_URL} = process.env

moongose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => retrievePost('64be4f673d55f3b03ce22b11', '64c0ca6ed2860ca911a44290'))
    .then((post)=> console.log(post))
    .catch(error => console.error(error))
    .finally(()=> moongose.disconnect())