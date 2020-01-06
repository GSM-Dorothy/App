const DeviceEnroll = require('models/device_enroll')
const AuthCode = require('models/auth_code')
const DeviceList = require('models/device_list')

const { DEVICE } = require('actions/auth_code')

exports.enrollDevice = async (ctx) => {
  let ip = ctx.request.ip.substr(7)
  let code = ctx.request.body.code

  let foundUser = await AuthCode.validateCode(code)

  ctx.assert(foundUser && foundUser.type === DEVICE, 401, 'Entered device code is invalid!')

  let enrollInfo = {
    IP: ip,
    code: code
  }

  ctx.body = await DeviceEnroll.addDeviceInfo(enrollInfo)
}

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
  let ips = ctx.request.body

  let result = await DeviceList.deleteDeviceFromList(ips)

  ctx.assert(result.n === 1 && result.deleteCount === ips.length && result.ok === ips.length, 401, 'Your device info wasn\'t completely deleted from the list!')

  ctx.body = 'Your device info was completely deleted from device list!'
}
