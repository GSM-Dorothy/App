const AuthCode = require('models/auth_code')
const User = require('models/user')
const DeviceEnroll = require('models/device_enroll')

const AuthCodeType = require('actions/auth_code')

exports.generateStudentCode = async (ctx) => {
  let studentInfo = ctx.request.body

  ctx.body = await AuthCode.generateStudentCode(studentInfo)
}

exports.generateAdministratorCode = async (ctx) => {
  let administratorInfo = ctx.request.body

  ctx.body = await AuthCode.generateAdministratorCode(administratorInfo)
}

exports.generateDeviceCode = async (ctx) => {
  let deviceInfo = ctx.request.body

  ctx.body = await AuthCode.generateDeviceCode(deviceInfo)
}

exports.findStudentCode = async (ctx) => {
  ctx.body = await AuthCode.findStudentCode()
}

exports.findAdministratorCode = async (ctx) => {
  ctx.body = await AuthCode.findAdministratorCode()
}

exports.findDeviceCode = async (ctx) => {
  ctx.body = await AuthCode.findDeviceCode()
}

exports.validateCode = async (ctx) => {
  let code = ctx.request.body.code

  ctx.body = await AuthCode.validateCode(code)
}

exports.revokeCode = async (ctx) => {
  let code = ctx.request.body.code

  ctx.body = await AuthCode.revokeCode(code)
}

exports.addFingerprint = async (ctx) => {
  let fingerprints = ctx.request.body.fingerprints
  let code = ctx.request.body.code

  let foundUser = await AuthCode.validateCode(code)

  if (foundUser) {
    await AuthCode.revokeCode(code)

    ctx.body = await User.updateFingerprint(foundUser.userID, fingerprints)
  } else {
    ctx.body = 'Provided device code is invaild.'
  }
}

exports.findAllFingerprints = async (ctx) => {
  ctx.body = await User.findAllFingerprints()
}

exports.validateFingerprintCode = async (ctx) => {
  ctx.req.setTimeout(5 * 60 * 1000)

  let enrollInfo = ctx.request.body
  let foundUser = await AuthCode.validateCode(enrollInfo.code)

  if (foundUser && foundUser.type === AuthCodeType.DEVICE) {
    await DeviceEnroll.addDeviceInfo(enrollInfo)
    ctx.response.status = 200
  } else {
    ctx.body = 'Entered device code is invalid!'
  }
}

exports.deleteFingerprintCode = async (ctx) => {
  let currentIP = ctx.request.ip.substr(7)
  let forwardedCode = (await DeviceEnroll.getDeviceInfo(currentIP)).code

  await DeviceEnroll.deleteDeviceInfo(currentIP)

  ctx.body = forwardedCode
}
