require('dotenv').config()
const mongoose = require('mongoose')
const authenticatedUser = require('./authenticateUser')

const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(()=> authenticatedUser('badbunny@gmail.com', '123123123'))
    .then(id => console.log(id))
    .catch(error => console.error(error))
    .finally(() => mongoose.disconnect())