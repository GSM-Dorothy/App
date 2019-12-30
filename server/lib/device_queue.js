const AuthCode = require('models/auth_code')
const DeviceEnroll = require('models/device_enroll')

const { DEVICE } = require('actions/auth_code')

exports.deviceQueueMiddleware = async (ctx, next) => {
  ctx.req.setTimeout(5 * 60 * 1000)

  let enrollInfo = ctx.request.body
  let foundUser = await AuthCode.validateCode(enrollInfo.code)

  if (!foundUser || foundUser.type !== DEVICE) {
    ctx.throw(401, 'Entered device code is invalid!')
  }

  await AuthCode.revokeCode(enrollInfo.code)

  await DeviceEnroll.addDeviceInfo(enrollInfo)

  next().then(async () => {
    await DeviceEnroll.deleteDeviceInfo(enrollInfo.IP)

    ctx.response.code = 200
  }).catch((err) => {
    console.log(err)
  })
}
