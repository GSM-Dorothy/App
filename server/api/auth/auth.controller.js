const jwt = require('jsonwebtoken')

const AuthCode = require('models/auth_code')
const User = require('models/user')
const DeviceEnroll = require('models/device_enroll')

const AuthCodeType = require('actions/auth_code')
const { TOKEN_EXPIRED, TOKEN_NON_EXIST } = require('actions/token')

var refreshTokens = {}

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
  let userData = ctx.request.body.userData

  if (await User.findUserByEmailAndPassword(userData)) {
    let accessToken = jwt.sign(userData, process.env.SECRET, { algorithm: 'HS256', expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN })
    let refreshToken = jwt.sign(userData, process.env.SECRET, { algorithm: 'HS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN })

    let response = {
      accessToken: accessToken,
      refreshToken: refreshToken
    }

    refreshTokens[refreshToken] = response

    ctx.body = response
  } else {
    ctx.body = TOKEN_NON_EXIST
  }
}

exports.refreshToken = async (ctx) => {
  let userData = ctx.request.body.userData
  let refreshToken = ctx.request.body.refreshToken
  let response = {}

  let accessToken = jwt.sign(userData, process.env.SECRET, { algorithm: 'HS256', expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN })

  if (refreshToken && refreshToken in refreshTokens) {
    response = {
      accessToken: accessToken
    }

    refreshTokens[refreshToken].accessToken = accessToken

    ctx.body = response
  } else {
    ctx.body = TOKEN_NON_EXIST
  }
}

exports.validateToken = async (ctx) => {
  const accessToken = ctx.request.body.accessToken || ctx.request.query.accessToken || ctx.request.headers['x-access-token']

  if (accessToken) {
    jwt.verify(accessToken, process.env.SECRET, function (err, decoded) {
      if (err) {
        ctx.body = TOKEN_EXPIRED
        return
      }
      ctx.body = decoded
    })
  } else {
    ctx.body = TOKEN_NON_EXIST
  }
}
