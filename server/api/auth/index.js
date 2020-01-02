const Router = require('koa-router')
const auth = new Router()

const codeCtrl = require('./code.controller')
const fingerprintCtrl = require('./fingerprint.controller')
const deviceCtrl = require('./device.controller')
const tokenCtrl = require('./token.controller')

const { validateTokenMiddleware } = require('lib/validate_token')
const { validateAdministrator } = require('lib/validate_user_type')

auth.get('/code/student', validateTokenMiddleware, validateAdministrator, codeCtrl.findStudentCode)
auth.post('/code/student', validateTokenMiddleware, validateAdministrator, codeCtrl.generateStudentCode)
auth.get('/code/administrator', validateTokenMiddleware, validateAdministrator, codeCtrl.findAdministratorCode)
auth.post('/code/administrator', validateTokenMiddleware, validateAdministrator, codeCtrl.generateAdministratorCode)
auth.get('/code/device', validateTokenMiddleware, codeCtrl.findDeviceCode)
auth.post('/code/device',validateTokenMiddleware, codeCtrl.generateDeviceCode)
auth.post('/code/validate', codeCtrl.validateCode)
auth.delete('/code', codeCtrl.revokeCode)

auth.get('/fingerprint', fingerprintCtrl.findAllFingerprints)
auth.post('/fingerprint', fingerprintCtrl.addFingerprint)

auth.get('/device/enroll', deviceCtrl.validateDevice)
auth.get('/device', validateTokenMiddleware, validateAdministrator, deviceCtrl.getAllDevices)
auth.post('/device', validateTokenMiddleware, validateAdministrator, deviceCtrl.addDeviceToList)
auth.delete('/device', validateTokenMiddleware, validateAdministrator, deviceCtrl.deleteDeviceFromList)

auth.get('/token', tokenCtrl.validateToken)
auth.post('/token/grant', tokenCtrl.grantToken)
auth.post('/token/refresh', tokenCtrl.refreshToken)

module.exports = auth
