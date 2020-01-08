const Router = require('koa-router')
const user = new Router()
const userCtrl = require('./user.controller')

const { validateTokenMiddleware } = require('lib/validate_token')
const { validateStudent, validateAdministrator } = require('lib/validate_user_type')

user.post('/create', userCtrl.createUser)

user.get('/student', validateTokenMiddleware, validateStudent, userCtrl.findStudent)
user.get('/students', validateTokenMiddleware, validateAdministrator, userCtrl.findAllStudents)

user.get('/point_archive', validateTokenMiddleware, validateStudent, userCtrl.findPointArchiveByStudent)
user.get('/point_archive/:grade/:class/:number', validateTokenMiddleware, validateAdministrator, userCtrl.findPointArchiveByAdmin)
user.post('/point_archive', validateTokenMiddleware, validateAdministrator, userCtrl.addPointArchive)
user.put('/point_archive', validateTokenMiddleware, validateAdministrator, userCtrl.updatePointArchive)
user.delete('/point_archive', validateTokenMiddleware, validateAdministrator, userCtrl.deletePointArchive)

module.exports = user
