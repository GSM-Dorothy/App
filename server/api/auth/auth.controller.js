const jwt = require('jsonwebtoken')

const AuthCode = require('models/auth_code')
const User = require('models/user')
const Token = require('models/token')

const DeviceEnroll = require('models/device_enroll')
const DeviceList = require('models/device_list')

const { ADMINISTRATOR } = require('actions/auth_code')
const { TOKEN_EXPIRED, TOKEN_NON_EXIST } = require('actions/token')

exports.generateStudentCode = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not exist(or is not administrator)!')
  }

  let studentInfo = ctx.request.body

  ctx.body = await AuthCode.generateStudentCode(studentInfo)
}

exports.generateAdministratorCode = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not exist(or is not administrator)!')
  }

  let administratorInfo = ctx.request.body

  ctx.body = await AuthCode.generateAdministratorCode(administratorInfo)
}

exports.generateDeviceCode = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser) {
    ctx.throw(401, 'This user is not exist!')
  }

  let deviceInfo = {
    userID: userID
  }

  ctx.body = await AuthCode.generateDeviceCode(deviceInfo)
}

exports.findStudentCode = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not exist(or is not administrator)!')
  }

  ctx.body = await AuthCode.findStudentCode()
}

exports.findAdministratorCode = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not exist(or is not administrator)!')
  }

  ctx.body = await AuthCode.findAdministratorCode()
}

exports.findDeviceCode = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser) {
    ctx.throw(401, 'This user is not exist!')
  }

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

exports.validateDevice = async (ctx) => {
  let currentIP = ctx.request.ip.substr(7)
  let deviceInfo = await DeviceEnroll.getDeviceInfo(currentIP)

  if (!deviceInfo) {
    ctx.throw(401, 'This device hasn\'t been authenticated.')
  }

  await DeviceEnroll.deleteDeviceInfo(currentIP)

  let response = {
    code: deviceInfo.code
  }

  ctx.body = response
}

exports.getAllDevices = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not exist(or is not administrator)!')
  }

  ctx.body = await DeviceList.findDeviceList()
}

exports.addDeviceToList = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not exist(or is not administrator)!')
  }

  let ip = ctx.request.body.IP

  ctx.body = await DeviceList.addDeviceToList(ip)
}

exports.deleteDeviceFromList = async (ctx) => {
  let userID = ctx.request.userID
  let foundUser = await User.findUserByID(userID)

  if (!foundUser || foundUser.userType !== ADMINISTRATOR) {
    ctx.throw(401, 'This user is not exist(or is not administrator)!')
  }

  let ip = ctx.request.body.IP

  let result = await DeviceList.deleteDeviceFromList(ip)

  if (result.n !== 1 || result.deleteCount !== 1 || result.ok !== 1) {
    ctx.throw(401, 'Your device info wasn\'t completely deleted from the list!')
  }

  let response = {
    IP: ip
  }

  ctx.body = response
}

exports.addFingerprint = async (ctx, next) => {
  let fingerprints = ctx.request.body.fingerprints
  let code = ctx.request.body.code

  let foundUser = await AuthCode.validateCode(code)

  if (!foundUser) {
    ctx.throw(401, 'Provided device code is invaild.')
  }

  let userID = foundUser.userID

  await AuthCode.revokeCode(code)

  let result = await User.updateFingerprint(userID, fingerprints)

  if (result.n !== 1 || result.nModified !== 1 || result.ok !== 1) {
    ctx.throw(401, "Your fingerprint datas weren't successfully forwarded.")
  }

  ctx.response.code = 200
}

exports.findAllFingerprints = async (ctx) => {
  ctx.body = await User.findAllFingerprints()
}

exports.grantToken = async (ctx) => {
  let loginData = ctx.request.body

  let foundUser = await User.findUserWithLoginData(loginData)

  if (!foundUser) {
    ctx.throw(401, TOKEN_NON_EXIST + ': Provided access token is invalid.')
  }

  let userID = foundUser._id

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

exports.grantTokenToDevice = async (ctx, next) => {
  let userID = ctx.request.body.userID

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

  ctx.request.body = response
  next()
}

exports.refreshToken = async (ctx) => {
  let refreshToken = ctx.request.body.refreshToken

  if (!refreshToken) {
    ctx.throw(401, TOKEN_NON_EXIST + ': Provide a valid refresh token!')
  }

  try {
    jwt.verify(refreshToken, process.env.SECRET)
  } catch (e) {
    let result = await User.revokeRefreshToken(refreshToken)

    if (result.n === 1 && result.deletedCount === 1 && result.ok === 1) {
      ctx.throw(401, TOKEN_EXPIRED + ': Please re-grant your token.')
    }

    ctx.throw(401, TOKEN_EXPIRED + ': Error occured while revoking refresh token.')
  }

  let foundUser = await User.findRefreshToken(refreshToken)

  if (!foundUser) {
    ctx.throw(401, 'This user is not exist!')
  }

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

  if (!tokenData) {
    ctx.throw(401, TOKEN_NON_EXIST + ': Please provide a valid token.')
  }

  let decoded
  let userID = tokenData.userID

  let foundUser = await User.findUserByID(userID)

  try {
    decoded = jwt.verify(accessToken, process.env.SECRET)
  } catch (e) {
    let result = await Token.revokeToken(accessToken)

    if (result.n === 1 && result.deletedCount === 1 && result.ok === 1) {
      ctx.throw(401, TOKEN_EXPIRED + ': Please refresh your token.')
    } else {
      ctx.throw(401, TOKEN_EXPIRED + ': Error occured while revoking token.')
    }
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
