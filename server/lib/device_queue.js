const AuthCode = require('models/auth_code')
const DeviceEnroll = require('models/device_enroll')

const { DEVICE } = require('actions/auth_code')

exports.deviceQueueMiddleware = async (ctx, next) => {
  ctx.req.setTimeout(5 * 60 * 1000)

  let deviceCode = ctx.request.body.code

  let foundUser = await AuthCode.validateCode(deviceCode)

  if (!foundUser || foundUser.type !== DEVICE) {
    ctx.throw(401, 'Provided device code is invalid.')
  }

  let currentIP = ctx.request.ip.substr(7)

  let enrollInfo = {
    IP: currentIP,
    code: deviceCode
  }

  await DeviceEnroll.addDeviceInfo(enrollInfo)

  next().then(async () => {
    currentIP = ctx.request.ip.substr(7)

    let result = await DeviceEnroll.deleteDeviceInfo(currentIP)

    if (result.n !== 1 || result.deleteCount !== 1 || result.ok !== 1) {
      ctx.throw(401, 'Your IP address was not authenticated in device!')
    }

    ctx.response.code = 200
  }).catch((err) => {
    console.log(err)
  })
}
