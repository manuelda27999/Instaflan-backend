require('dotenv').config()
const mongoose = require('mongoose')
const createPost = require('./createPost')

const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
 .then(() => createPost('64c2a23b49d5974c2c044baf', 
    'https://okdiario.com/img/2021/04/13/bad-bunny-655x368.jpg', 
    'enamoraoh...'))
 .then(()=> console.log('post created'))
 .catch(error => console.error(error))
 .finally(()=> mongoose.disconnect())