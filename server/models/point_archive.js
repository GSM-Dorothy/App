const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const PointArchive = new Schema({
  userID: ObjectId,
  grade: String,
  class: String,
  number: String,
  room: String,
  archive: Array
})

PointArchive.statics.findAllPointArchive = async function (studentInfo) {
  return (await this.findOne({ $and: [
    { userID: studentInfo.userID },
    { grade: studentInfo.grade },
    { class: studentInfo.class },
    { number: studentInfo.number },
    { name: studentInfo.name }
  ] }).exec()).archive
}

PointArchive.statics.addPointArchive = async function (archive) {
  return (await this.findOneAndUpdate({ userID: archive.userID }, { $push: { archive: archive.archive } })).exec()
}

PointArchive.statics.updatePointArchive = async function (archive) {
  return (await this.findOneAndUpdate({ 'archive.date': archive.date }, { $set: {
    'archive.$.reason': archive.reason,
    'archive.$.point': archive.point
  } })).exec()
}

PointArchive.statics.deletePointArchive = async function (archive) {
  return (await this.deleteOne({ userID: archive.userID })).exec()
}

const _pointArchive = mongoose.model('PointArchive', PointArchive, 'PointArchive')

module.exports = _pointArchive
