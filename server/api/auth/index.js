const Router = require('koa-router')
const auth = new Router()
const authCtrl = require('./auth.controller')

const { validateTokenMiddleware } = require('lib/validate_token')
const { deviceQueueMiddleware } = require('lib/device_queue')
const { grantDeviceTokenMiddleware } = require('lib/grant_device_token')

auth.get('/code/student', validateTokenMiddleware, authCtrl.findStudentCode)
auth.get('/code/administrator', validateTokenMiddleware, authCtrl.findAdministratorCode)
auth.get('/code/device', validateTokenMiddleware, authCtrl.findDeviceCode)

auth.post('/code/validate', authCtrl.validateCode)
auth.post('/code/student', authCtrl.generateStudentCode)
auth.post('/code/administrator', authCtrl.generateAdministratorCode)
auth.post('/code/device', authCtrl.generateDeviceCode)
auth.delete('/code', authCtrl.revokeCode)

auth.get('/device/enroll', authCtrl.validateDevice)
auth.get('/device', validateTokenMiddleware, authCtrl.getAllDevices)
auth.post('/device', validateTokenMiddleware, authCtrl.addDeviceToList)
auth.delete('/device', validateTokenMiddleware, authCtrl.deleteDeviceFromList)

auth.get('/fingerprint', authCtrl.findAllFingerprints)
auth.post('/fingerprint', deviceQueueMiddleware, authCtrl.addFingerprint)

auth.get('/token', authCtrl.validateToken)
auth.post('/token/grant', authCtrl.grantToken)
auth.post('/token/refresh', authCtrl.refreshToken)

auth.post('/token/device', grantDeviceTokenMiddleware, authCtrl.grantTokenToDevice)

module.exports = auth
