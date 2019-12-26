const Router = require('koa-router')
const auth = new Router()
const authCtrl = require('./auth.controller')

auth.get('/code/student/:id', authCtrl.findStudentCode)
auth.get('/code/administrator/:id', authCtrl.findAdministratorCode)
auth.get('/code/device/:id', authCtrl.findDeviceCode)

auth.post('/code/validate', authCtrl.validateCode)
auth.post('/code/student', authCtrl.generateStudentCode)
auth.post('/code/administrator', authCtrl.generateAdministratorCode)
auth.post('/code/device', authCtrl.generateDeviceCode)
auth.delete('/code', authCtrl.revokeCode)

auth.get('/fingerprint', authCtrl.findAllFingerprints)
auth.post('/fingerprint', authCtrl.addFingerprint)

auth.get('/device/enroll', authCtrl.deleteFingerprintCode)
auth.post('/device/enroll', authCtrl.validateFingerprintCode)

auth.post('/token', authCtrl.grantToken)

module.exports = auth
