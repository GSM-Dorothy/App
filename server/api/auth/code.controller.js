const AuthCode = require('models/auth_code')

exports.generateStudentCode = async (ctx) => {
  let studentInfo = ctx.request.body

  ctx.body = await AuthCode.generateStudentCode(studentInfo)
}

exports.generateAdministratorCode = async (ctx) => {
  let administratorInfo = ctx.request.body

  ctx.body = await AuthCode.generateAdministratorCode(administratorInfo)
}

exports.generateDeviceCode = async (ctx) => {
  let deviceInfo = {
    userID: ctx.state.userID
  }

  let result = await AuthCode.generateDeviceCode(deviceInfo)

  ctx.assert(Object.keys(result).length, 401, 'This device authentication code was already generated!')

  ctx.body = result
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
  let codes = ctx.request.body

  let result = await AuthCode.revokeCode(codes)

  ctx.assert(result.n === codes.length && result.ok === 1 && result.deletedCount === codes.length, 401, 'Authentication code wasn\'t deleted properly.')

  ctx.body = 'Provided authentication code was deleted.'
}
