const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuthCode = new Schema({
  studentInfo: {
    grade: Number,
    class: Number,
    name: String
  },
  code: String
})

const AuthCodes = mongoose.model('AuthCode', AuthCode, 'AuthCode')

module.exports = AuthCodes
