const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeviceEnroll = new Schema({
  IP: String,
  code: String
})

DeviceEnroll.statics.addDeviceInfo = async function (deviceInfo) {
  let results = await this.insertOne({
    IP: deviceInfo.IP,
    code: deviceInfo.code
  }).exec()

  return results
}
DeviceEnroll.statics.getDeviceInfo = async function (ip) {
  let result = await this.findOne({ IP: ip }).exec()

  return result
}

const _deviceEnroll = mongoose.model('DeviceEnroll', DeviceEnroll, 'DeviceEnroll')

module.exports = _deviceEnroll
