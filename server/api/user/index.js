const Router = require('koa-router')
const user = new Router()
const userCtrl = require('./user.controller')

const { validateTokenMiddleware } = require('lib/validate_token')

user.post('/create', userCtrl.createUser)

user.get('/student', validateTokenMiddleware, userCtrl.findStudent)

user.get('/point_archive', validateTokenMiddleware, userCtrl.findPointArchiveByStudent)
user.get('/point_archive/:grade/:class/:number', validateTokenMiddleware, userCtrl.findPointArchiveByAdmin)
user.post('/point_archive', validateTokenMiddleware, userCtrl.addPointArchive)
user.put('/point_archive', validateTokenMiddleware, userCtrl.updatePointArchive)
user.delete('/point_archive', validateTokenMiddleware, userCtrl.deletePointArchive)

module.exports = user
