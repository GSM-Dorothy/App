const jwt = require('jsonwebtoken')

const AuthCode = require('models/auth_code')
const User = require('models/user')
const DeviceEnroll = require('models/device_enroll')
const Token = require('models/token')

const AuthCodeType = require('actions/auth_code')
const { TOKEN_EXPIRED, TOKEN_NON_EXIST } = require('actions/token')

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

  console.log(foundUser)

  if (foundUser) {
    await AuthCode.revokeCode(code)

    let result = await User.updateFingerprint(foundUser.userID, fingerprints)

    console.log(result)
    if (result.n === 1 && result.nModified === 1 && result.ok === 1) {
      ctx.body = 'Your fingerprint datas are successfully forwarded!'
    } else {
      ctx.body = "Your fingerprint datas weren't successfully forwarded."
    }
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

exports.grantToken = async (ctx) => {
  let loginData = ctx.request.body

  let foundUser = await User.findUserWithLoginData(loginData)

  if (foundUser) {
    let userID = foundUser._id

    let accessToken = jwt.sign({}, process.env.SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN })
    let refreshToken = jwt.sign({}, process.env.SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN })

    let accessDecoded = jwt.decode(accessToken, { complete: true })
    let refreshDecoded = jwt.decode(refreshToken, { complete: true })

    let accessExpireDate = accessDecoded.payload.exp * 1000
    let refreshExpireDate = refreshDecoded.payload.exp * 1000

    let tokenData = {
      accessToken: accessToken,
      userID: userID,
      expireDate: accessExpireDate
    }

    let refreshTokenData = {
      value: refreshToken,
      expireDate: refreshExpireDate
    }

    await Token.storeToken(tokenData)

    await User.storeRefreshToken(userID, refreshTokenData)

    let response = {
      accessToken: accessToken,
      refreshToken: refreshToken
    }

    ctx.body = response
  } else {
    ctx.body = TOKEN_NON_EXIST
  }
}

exports.refreshToken = async (ctx) => {
  let refreshToken = ctx.request.body.refreshToken
  let response = {}

  try {
    jwt.verify(refreshToken, process.env.SECRET)
  } catch (e) {
    let result = await User.revokeRefreshToken(refreshToken)

    if (result.n === 1 && result.deletedCount === 1 && result.ok === 1) {
      ctx.throw(401, TOKEN_EXPIRED + ': Please re-grant your token.')
    } else {
      ctx.throw(401, TOKEN_EXPIRED + ': Error occured while revoking token.')
    }

    return
  }

  let foundUser = await User.findRefreshToken(refreshToken)

  if (foundUser) {
    let userID = foundUser._id

    let accessToken = jwt.sign({}, process.env.SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN })
    let expireDate = jwt.decode(accessToken, { complete: true }).payload.exp * 1000

    let tokenData = {
      accessToken: accessToken,
      userID: userID,
      expireDate: expireDate
    }

    await Token.storeToken(tokenData)

    response = {
      accessToken: accessToken
    }

    ctx.body = response
  } else {
    ctx.throw(401, TOKEN_NON_EXIST + ': Provide a valid refresh token!')
  }
}

exports.validateToken = async (ctx) => {
  const accessToken = ctx.request.body.accessToken || ctx.request.query.accessToken || ctx.request.headers['x-access-token']

  let foundTokenData = await Token.findToken(accessToken)

  if (foundTokenData) {
    let decoded
    let userID = foundTokenData.userID

    let foundUser = await User.findUserByID(userID)
    let userType = foundUser.userType

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

    let response = {
      createdDate: createdDate.toISOString(),
      expireDate: expireDate.toISOString(),
      userType: userType
    }

    ctx.body = response
  } else {
    ctx.throw(401, TOKEN_NON_EXIST + ': Please provide a valid token.')
  }
}
