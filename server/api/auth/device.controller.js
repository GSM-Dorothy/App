const DeviceEnroll = require('models/device_enroll')
const DeviceList = require('models/device_list')

exports.validateDevice = async (ctx) => {
  let currentIP = ctx.request.ip.substr(7)
  let deviceInfo = await DeviceEnroll.getDeviceInfo(currentIP)

  ctx.assert(deviceInfo, 401, 'This device hasn\'t been authenticated.')

  await DeviceEnroll.deleteDeviceInfo(currentIP)

  let response = {
    code: deviceInfo.code
  }

  ctx.body = response
}

exports.getAllDevices = async (ctx) => {
  ctx.body = await DeviceList.findDeviceList()
}

exports.validateDeviceList = async (ctx) => {
  let ip = ctx.request.ip.substr(7)

  let foundDevice = await DeviceList.validateDeviceList(ip)

  ctx.assert(foundDevice, 401, 'This device hasn\'t added to device list!')

  ctx.body = 'This device exists in device list.'
}

exports.addDeviceToList = async (ctx) => {
  let ip = ctx.request.body.IP

  ctx.body = await DeviceList.addDeviceToList(ip)
}

exports.deleteDeviceFromList = async (ctx) => {
  let ip = ctx.request.body.IP

  let result = await DeviceList.deleteDeviceFromList(ip)

  ctx.assert(result.n === 1 && result.deleteCount === 1 && result.ok === 1, 401, 'Your device info wasn\'t completely deleted from the list!')

  let response = {
    IP: ip
  }

  ctx.body = response
}
