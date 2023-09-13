require('dotenv').config()
const {mongoose} = require('mongoose')
const registerUser = require('./registerUser')
const {MONGODB_URL} = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
.then(()=> registerUser('Paco', 
    'https://media.revistagq.com/photos/5fc0cb787e8773c13e83a61e/16:9/w_2560%2Cc_limit/GettyImages-1280266077.jpg',
    'I am the number one reggaeton singer',
    'paco@gmail.com',
    '123123123'))
.then(()=> console.log('user register'))
.catch(error => console.error(error))
.finally(() => mongoose.disconnect())