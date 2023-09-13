require('dotenv').config()

const editPost = require('./editPost')
const mongoose = require('mongoose')

const {MONGODB_URL} = process.env 

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
.then(() => editPost('64be4f673d55f3b03ce22b11', '64c0ca73ec92c3932e6ce5df', 
    'https://okdiario.com/img/2021/04/13/bad-bunny-655x368.jpg',
    'intenso'))    
.then(()=> console.log('post edited'))
.catch(error => console.error(error))
.finally(()=> mongoose.disconnect())