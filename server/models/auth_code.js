const mongoose = require('mongoose')
const cryptoRandomString = require('crypto-random-string')
const Schema = mongoose.Schema

const AuthCode = new Schema({
  name: String,
  userInfo: {
    type: String,
    email: String,
    password: String,
    phone: String,
    name: String,
    fingerprint: Array,
    NFC: String,
    studentInfo: {
      grade: String,
      class: String,
      number: String,
      room: String
    },
    administratorInfo: {
      responsibility: String
    }
  },
  code: String
})

AuthCode.statics.generateCode = async function (studentInfo) {
  let authCode = new this({
    'studentInfo.grade': studentInfo.grade,
    'studentInfo.class': studentInfo.class,
    'studentInfo.name': studentInfo.name,
    'code': cryptoRandomString({ length: 6 })
  })

  await authCode.save()

  return authCode
}

AuthCode.statics.validateCode = async function (code) {
  let foundUser = (await this.findOne({ code: code }).exec()).userInfo

  return foundUser
}

AuthCode.statics.revokeCode = async function (code) {
  return { code: (await this.findOneAndDelete({ code: code }).exec()).code }
}

const _authCode = mongoose.model('AuthCode', AuthCode, 'AuthCode')

module.exports = _authCode
