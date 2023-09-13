require('dotenv').config()
const deletePost = require('./deletePost')
const mongoose = require('mongoose')

const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => deletePost('64be4f673d55f3b03ce22b11', '64beaca87f3ea995d3d6d200'))
    .then(() => console.log('post deleted'))
    .catch(error => console.error(error))
    .finally(()=> mongoose.disconnect())