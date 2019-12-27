const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PointArchive = new Schema({
  grade: Number,
  class: Number,
  number: Number,
  room: Number,
  name: String,
  archive: [new Schema({ date: Date, reason: String, point: Number }, { _id: false })]
})

PointArchive.statics.findPointArchive = async function (studentInfo) {
  let found = await this.findOne({ $and: [
    { grade: studentInfo.grade },
    { class: studentInfo.class },
    { number: studentInfo.number }
  ] }).exec()

  if (found) {
    return found.archive
  } else {
    return []
  }
}

PointArchive.statics.addPointArchive = async function (studentInfo) {
  let pointArchiveData = {
    grade: studentInfo.grade,
    class: studentInfo.class,
    number: studentInfo.number,
    room: studentInfo.room,
    name: studentInfo.name,
    archive: []
  }

  let pointArchive = new this(pointArchiveData)

  await pointArchive.save()

  return pointArchive
}

PointArchive.statics.updatePointArchive = async function (studentInfo, archive) {
  let result = await this.updateOne({ $and: [
    { grade: studentInfo.grade },
    { class: studentInfo.class },
    { number: studentInfo.number },
    { 'archive.date': archive.date }
  ] }, { $set:
    { 'archive.$.reason': archive.reason, 'archive.$.point': archive.point }
  }).exec()

  if (result.n === 0 || result.nModified === 0) {
    result = await this.updateOne({ $and: [
      { grade: studentInfo.grade },
      { class: studentInfo.class },
      { number: studentInfo.number },
      { 'archive.date': { $ne: archive.date } }
    ] }, { $push: {
      archive: { date: archive.date, reason: archive.reason, point: archive.point }
    } }).exec()
  }

  return result
}

PointArchive.statics.deletePointArchive = async function (studentInfo, archive) {
  let result = await this.updateOne({ $and: [
    { grade: studentInfo.grade },
    { class: studentInfo.class },
    { number: studentInfo.number },
    { 'archive.date': archive.date }
  ] }, { $pull: { archive: { date: archive.date } } }).exec()

  return result
}

const _pointArchive = mongoose.model('PointArchive', PointArchive, 'PointArchive')

module.exports = _pointArchive
