const jwt = require('jsonwebtoken')

const Token = require('models/token')
const User = require('models/user')

exports.grantDeviceTokenMiddleware = async (ctx, next) => {
  ctx.req.setTimeout(5 * 60 * 1000)

  let userID = ctx.request.body

  let accessToken = jwt.sign({}, process.env.SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN })
  let accessExpireDate = jwt.decode(accessToken, { complete: true }).payload.exp * 1000

  let tokenData = {
    accessToken: accessToken,
    userID: userID,
    expireDate: accessExpireDate
  }

  await Token.storeToken(tokenData)

  let refreshToken = jwt.sign({}, process.env.SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN })
  let refreshExpireDate = jwt.decode(refreshToken, { complete: true }).payload.exp * 1000

  let refreshTokenData = {
    value: refreshToken,
    expireDate: refreshExpireDate
  }

  await User.storeRefreshToken(userID, refreshTokenData)

  let response = {
    accessToken: accessToken,
    refreshToken: refreshToken
  }

  next().then(async () => {
    ctx.body = response
  }).catch((err) => {
    console.log(err)
  })
}