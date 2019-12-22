const Router = require('koa-router')
const user = new Router()
const userCtrl = require('./user.controller')

user.get('/student/:id', userCtrl.findStudentByID)
user.post('/create', userCtrl.createUser)

user.get('/point_archive/:grade/:class/:number/:name', userCtrl.findPointArchiveByStudentInfo)
user.post('/point_archive', userCtrl.addPointArchive)
user.put('/point_archive', userCtrl.updatePointArchive)
user.delete('/point_archive', userCtrl.deletePointArchive)

module.exports = user
