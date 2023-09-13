require('dotenv').config()
const moongose = require('mongoose')
const retrieveNotifications = require('./retrieveNotifications')

const {MONGODB_URL} = process.env

moongose.connect(`${MONGODB_URL}/instaflan-data`)
    .then(() => retrieveNotifications('64c7ee98da7e74addbcf851e'))
    .then((notifications)=> console.log(notifications))
    .catch(error => console.error(error))
    .finally(()=> moongose.disconnect())