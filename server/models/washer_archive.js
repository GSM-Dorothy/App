const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const WasherArchive = new Schema({
  floor: String,
  location: String,
  userID: ObjectId,
  startTime: Date,
  finishTime: Date
})

WasherArchive.statics.latestArchive = async function (washer) {
  let result = this.find({ floor: washer.floor, location: washer.location }).sort({ _id: -1 }).limit(1).exec()

  return result
}

WasherArchive.statics.useWasher = async function (washer, userID, startTime) {
  let _startTime = new Date(startTime)
  let _finishTime = new Date(startTime)

  _finishTime.setMinutes(_startTime.getMinutes() + 90)

  let archiveInfo = {
    floor: washer.floor,
    location: washer.location,
    userID: userID,
    startTime: _startTime.toISOString(),
    finishTime: _finishTime.toISOString()
  }

  let archive = new this(archiveInfo)

  await archive.save()

  return archive
}

const _washerArchive = mongoose.model('WasherArchive', WasherArchive, 'WasherArchive')

module.exports = _washerArchive
