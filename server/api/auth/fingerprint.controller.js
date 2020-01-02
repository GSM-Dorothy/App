const AuthCode = require('models/auth_code')
const User = require('models/user')

exports.addFingerprint = async (ctx) => {
  let fingerprints = ctx.request.body.fingerprints
  let code = ctx.request.body.code

  let foundUser = await AuthCode.validateCode(code)

  ctx.assert(foundUser, 401, 'Provided device code is invaild.')

  let userID = foundUser.userID

  await AuthCode.revokeCode(code)

  let result = await User.updateFingerprint(userID, fingerprints)

  ctx.assert(result.n === 1 && result.nModified === 1 && result.ok === 1, 401, "Your fingerprint datas weren't successfully forwarded.")

  ctx.response.code = 200
}

exports.findAllFingerprints = async (ctx) => {
  ctx.body = await User.findAllFingerprints()
}