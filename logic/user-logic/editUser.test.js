require('dotenv').config()

const editUser = require('./editUser')
const mongoose = require('mongoose')

const { MONGODB_URL } = process.env

mongoose.connect(`${MONGODB_URL}/instaflan-test`)
    .then(() => editUser('64be4f673d55f3b03ce22b11',
        'Bad Bunny yeye',
        'https://www.mondosonoro.com/wp-content/uploads/2020/11/bad-bunny-promo.jpg',
        'el rey del trap'))
    .then(() => console.log('user edited'))
    .catch(error => console.error(error))
    .finally(() => mongoose.disconnect())