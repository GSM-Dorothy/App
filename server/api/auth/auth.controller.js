const AuthCode = require('models/auth_code')

exports.generateCode = async (ctx) => {
  let studentInfo = ctx.request.body

  ctx.body = await AuthCode.generateCode(studentInfo)
}

exports.validateCode = async (ctx) => {
  let code = ctx.request.body.code

  ctx.body = await AuthCode.validateCode(code)
}

exports.revokeCode = async (ctx) => {
  let code = ctx.request.body.code

  ctx.body = await AuthCode.revokeCode(code)
}
