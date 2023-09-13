require('dotenv').config()
const moongose = require('mongoose')
const deleteAllNotifications = require('./deleteAllNotifications')

const {MONGODB_URL} = process.env

moongose.connect(`${MONGODB_URL}/instaflan-data`)
    .then(() => deleteAllNotifications('64c7ee98da7e74addbcf851e'))
    .then(()=> console.log('all notification deleted'))
    .catch(error => console.error(error))
    .finally(()=> moongose.disconnect())