const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const remainArchive = new Schema({
  userID: ObjectId,
  remainType: String,
  startDate: Date,
  finishDate: Date,
  reason: String
})

remainArchive.statics.findArchive = async function (userID) {
  let results = this.find({ userID: userID }).exec()

  return results
}

remainArchive.statics.findArchiveByDate = async function (start, end) {
  let results = this.find({ $or: [
    { startDate: { $lte: start }, finishDate: { $gte: start } },
    { startDate: { $gte: start, $lt: end }, finishDate: { $gte: start } }
  ] }).exec()

  return results
}

remainArchive.statics.findAllArchive = async function () {
  let results = this.find().exec()

  return results
}

remainArchive.statics.addArchive = async function (archiveInfo) {
  let archiveData = {
    userID: archiveInfo.userID,
    remainType: archiveInfo.remainType,
    startDate: archiveInfo.startDate,
    finishDate: archiveInfo.finishDate,
    reason: archiveInfo.reason
  }

  let archiveItem = new this(archiveData)

  await archiveItem.save()

  return archiveItem
}

remainArchive.statics.deleteArchive = async function (archiveInfo) {
  let result = this.deleteOne({ $and: [
    { userID: archiveInfo.userID },
    { remainType: archiveInfo.remainType },
    { startDate: archiveInfo.startDate }
  ] }).exec()

  return result
}

const _remainArchive = mongoose.models.RemainArchive || mongoose.model('RemainArchive', remainArchive, 'RemainArchive')

module.exports = _remainArchive
