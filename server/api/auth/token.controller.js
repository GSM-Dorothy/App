const jwt = require('jsonwebtoken')

const Token = require('models/token')
const User = require('models/User')

const { TOKEN_EXPIRED, TOKEN_NON_EXIST } = require('actions/token')

exports.grantToken = async (ctx) => {
  let userID

  if (ctx.request.body.userID) {
    userID = ctx.request.body.userID
  } else {
    let loginData = ctx.request.body
    let foundUser = await User.findUserWithLoginData(loginData)
  
    userID = foundUser._id

    ctx.assert(foundUser, 401, TOKEN_NON_EXIST + ': Provided access token is invalid.')
  }

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

  ctx.body = response
}

exports.refreshToken = async (ctx) => {
  let refreshToken = ctx.request.body.refreshToken

  ctx.assert(refreshToken, 401, TOKEN_NON_EXIST + ': Provide a valid refresh token!')

  try {
    jwt.verify(refreshToken, process.env.SECRET)
  } catch (e) {
    let result = await User.revokeRefreshToken(refreshToken)

    ctx.assert(result.n === 1 && result.deletedCount === 1 && result.ok === 1, 401, TOKEN_EXPIRED + ': Error occured while revoking refresh token.')

    ctx.throw(401, TOKEN_EXPIRED + ': Please re-grant your token.')
  }

  let foundUser = await User.findRefreshToken(refreshToken)

  ctx.assert(foundUser, 401, 'This user is not exist!')

  let accessToken = jwt.sign({}, process.env.SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN })
  let userID = foundUser._id
  let expireDate = jwt.decode(accessToken, { complete: true }).payload.exp * 1000

  let tokenData = {
    accessToken: accessToken,
    userID: userID,
    expireDate: expireDate
  }

  await Token.storeToken(tokenData)

  let response = {
    accessToken: accessToken
  }

  ctx.body = response
}

exports.validateToken = async (ctx) => {
  const accessToken = ctx.request.headers['x-access-token']

  let tokenData = await Token.findToken(accessToken)

  ctx.assert(tokenData, 401, TOKEN_NON_EXIST + ': Please provide a valid token.')

  let decoded
  let userID = tokenData.userID

  let foundUser = await User.findUserByID(userID)

  try {
    decoded = jwt.verify(accessToken, process.env.SECRET)
  } catch (e) {
    let result = await Token.revokeToken(accessToken)

    ctx.assert(result.n === 1 && result.deletedCount === 1 && result.ok === 1, 401, TOKEN_EXPIRED + ': Error occured while revoking token.')

    ctx.throw(401, TOKEN_EXPIRED + ': Please refresh your token.')
  }

  let createdDate = new Date(decoded.iat * 1000)
  let expireDate = new Date(decoded.exp * 1000)
  let userType = foundUser.userType

  let response = {
    createdDate: createdDate.toISOString(),
    expireDate: expireDate.toISOString(),
    userType: userType
  }

  ctx.body = response
}
