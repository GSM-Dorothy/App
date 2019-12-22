const mongoose = require('mongoose')
const cryptoRandomString = require('crypto-random-string')
const Schema = mongoose.Schema

const AuthCodeType = require('actions/auth_code')

const AuthCode = new Schema({
  type: String,
  userInfo: {
    type: String,
    email: String,
    password: String,
    phone: String,
    name: String,
    studentInfo: {
      grade: Number,
      class: Number,
      number: Number,
      room: Number
    },
    administratorInfo: {
      responsibility: String
    }
  },
  code: String
})

AuthCode.statics.generateStudentCode = async function (studentInfo) {
  let authCode = new this({
    userInfo: {
      type: studentInfo.type,
      email: studentInfo.email,
      password: studentInfo.password,
      phone: studentInfo.phone,
      name: studentInfo.name,
      studentInfo: {
        grade: studentInfo.grade,
        class: studentInfo.class,
        number: studentInfo.number,
        room: studentInfo.room
      }
    },
    code: studentInfo.type === AuthCodeType.DEVICE ? cryptoRandomString({ length: 6, characters: '1234567890' }) : cryptoRandomString({ length: 6 })
  })

  await authCode.save()

  return authCode
}

AuthCode.statics.generateAdministratorCode = async function (administratorInfo) {
  let authCode = new this({
    userInfo: {
      type: administratorInfo.type,
      email: administratorInfo.email,
      password: administratorInfo.password,
      phone: administratorInfo.phone,
      name: administratorInfo.name,
      administratorInfo: {
        responsibility: administratorInfo.responsibility
      }
    },
    code: administratorInfo.type === AuthCodeType.DEVICE ? cryptoRandomString({ length: 6, characters: '1234567890' }) : cryptoRandomString({ length: 6 })
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
