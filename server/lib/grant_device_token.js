const DeviceEnroll = require('models/device_enroll')

exports.grantDeviceTokenMiddleware = async (ctx, next) => {
  ctx.req.setTimeout(5 * 60 * 1000)

  let currentIP = ctx.request.ip.substr(7)

  let enrollInfo = {
    IP: currentIP
  }

  await DeviceEnroll.addDeviceInfo(enrollInfo)

  next().then(async () => {
    let tokens = ctx.request.body.token

    ctx.body = tokens
  }).catch((err) => {
    console.log(err)
  })
}
