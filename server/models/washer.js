const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { IDLE } = require('actions/washer')

const Washer = new Schema({
  floor: String,
  location: String,
  status: String
})

Washer.statics.addWasher = async function (washerInfo) {
  let washerData = {
    floor: washerInfo.floor,
    location: washerInfo.location,
    status: IDLE
  }

  let washer = new this(washerData)

  await washer.save()

  return washer
}

Washer.statics.findByInfo = async function (washer) {
  let result = await this.findOne({ floor: washer.floor, location: washer.location }).exec()

  return result
}

Washer.statics.changeStatus = async function (washer, status) {
  let result = await this.updateOne({ floor: washer.floor, location: washer.location }, { $set: { status: status } }).exec()

  return result
}

const _washer = mongoose.model('Washer', Washer, 'Washer')

module.exports = _washer
