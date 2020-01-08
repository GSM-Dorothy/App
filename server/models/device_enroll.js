const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeviceEnroll = new Schema({
  IP: String,
  code: String
})

DeviceEnroll.statics.getDeviceInfo = async function (ip) {
  let result = await this.findOne({ IP: ip }).exec()

  return result
}

DeviceEnroll.statics.addDeviceInfo = async function (deviceInfo) {
  let deviceInfoData = new this({
    IP: deviceInfo.IP,
    code: deviceInfo.code
  })

  await deviceInfoData.save()

  return deviceInfo
}
DeviceEnroll.statics.deleteDeviceInfo = async function (ip) {
  let result = await this.deleteOne({ IP: ip }).exec()

  return result
}

const _deviceEnroll = mongoose.models.DeviceEnroll || mongoose.model('DeviceEnroll', DeviceEnroll, 'DeviceEnroll')

module.exports = _deviceEnroll
