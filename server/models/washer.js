const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const WasherStatus = require('action/washer')

const Washer = new Schema({
  floor: String,
  location: String,
  status: String
})

Washer.statics.findByInfo = async function (washer) {
  return (await this.findOne({ floor: washer.floor, location: washer.location })).exec()
}

Washer.statics.changeStatus = async function (washer, status) {
  return (await this.findOneAndUpdate({ floor: washer.floor, location: washer.location }, { $set: { status: status } })).exec()
}

const _washer = mongoose.model('Washer', Washer, 'Washer')

module.exports = _washer
