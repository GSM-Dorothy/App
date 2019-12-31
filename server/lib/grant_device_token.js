const DeviceEnroll = require('models/device_enroll')

exports.grantDeviceTokenMiddleware = async (ctx, next) => {
  ctx.req.setTimeout(5 * 60 * 1000)

  let currentIP = ctx.request.ip.substr(7)

  let enrollInfo = {
    IP: currentIP
  }

  await DeviceEnroll.addDeviceInfo(enrollInfo)

  next().then(async () => {
    currentIP = ctx.request.ip.substr(7)

    let result = await DeviceEnroll.deleteDeviceInfo(currentIP)

    if (result.n !== 1 || result.deleteCount !== 1 || result.ok !== 1) {
      ctx.throw(401, 'Your IP address was not authenticated in device!')
    }

    let tokens = ctx.request.body

    ctx.body = tokens
  }).catch((err) => {
    console.log(err)
  })
}
