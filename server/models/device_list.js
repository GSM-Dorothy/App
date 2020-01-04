const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeviceList = new Schema({
  IP: String
})

DeviceList.statics.findDeviceList = async function () {
  let results = this.find({}, { _id: 0, IP: 1 }).exec()

  return results
}

DeviceList.statics.validateDeviceList = async function (ip) {
  let results = this.find({ IP: ip }).exec()

  return results
}

DeviceList.statics.addDeviceToList = async function (ip) {
  let _deviceList = new this({
    IP: ip
  })

  await _deviceList.save()

  return _deviceList
}

DeviceList.statics.deleteDeviceFromList = async function (ip) {
  let result = this.deleteOne({ IP: ip }).exec()

  return result
}

const _deviceList = mongoose.models.DeviceList || mongoose.model('DeviceList', DeviceList, 'DeviceList')

module.exports = _deviceList
