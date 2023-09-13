require('dotenv').config()
const moongose = require('mongoose')
const deleteNotification = require('./deleteNotification')

const {MONGODB_URL} = process.env

moongose.connect(`${MONGODB_URL}/instaflan-data`)
    .then(() => deleteNotification('64c7ee98da7e74addbcf851e','64ddcb1f3f1eba1f93fdb6c8'))
    .then(()=> console.log('notification deleted'))
    .catch(error => console.error(error))
    .finally(()=> moongose.disconnect())