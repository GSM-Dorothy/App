const AuthCodes = require('models/auth_code')

exports.validateUser = async (ctx) => {
  let studentInfo = ctx.request.body
  console.log(studentInfo)
  ctx.body = (await AuthCodes.findOne({ 'studentInfo.grade': studentInfo.grade }).exec()).code
}
