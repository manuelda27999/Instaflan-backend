require('dotenv').config()
const {mongoose} = require('mongoose')
const createComment = require('./createComment')
const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
.then(()=> createComment('64be4f673d55f3b03ce22b11', '64c0ca6ed2860ca911a44290', 'hello bro'))
.then(()=> console.log('comment created'))
.catch(error => console.error(error))
.finally(() => mongoose.disconnect())