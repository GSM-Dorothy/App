const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
// const WasherStatus = require('action/washer')

const WasherArchive = new Schema({
  washerID: ObjectId,
  userID: ObjectId,
  startTime: Date,
  finishTime: Date
})

const _washerArchive = mongoose.model('WasherArchive', WasherArchive, 'WasherArchive')

module.exports = _washerArchive
