const AuthCode = require('models/auth_code')

exports.generateStudentCode = async (ctx) => {
  let studentInfo = ctx.request.body

  console.log(studentInfo)
  ctx.body = await AuthCode.generateStudentCode(studentInfo)
}

exports.generateAdministratorCode = async (ctx) => {
  let administratorInfo = ctx.request.body

  ctx.body = await AuthCode.generateAdministratorCode(administratorInfo)
}

exports.validateCode = async (ctx) => {
  let code = ctx.request.body.code

  ctx.body = await AuthCode.validateCode(code)
}

exports.revokeCode = async (ctx) => {
  let code = ctx.request.body.code

  ctx.body = await AuthCode.revokeCode(code)
}
