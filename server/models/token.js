const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Token = new Schema({
  accessToken: String,
  userID: String,
  expireDate: Date
})

Token.statics.storeToken = async function (tokenData) {
  let _tokenData = new this({
    accessToken: tokenData.accessToken,
    userID: tokenData.userID,
    expireDate: tokenData.expireDate
  })

  await _tokenData.save()

  return _tokenData
}

Token.statics.findToken = async function (accessToken) {
  let result = await this.findOne({ accessToken: accessToken }).exec()

  return result
}

Token.statics.revokeToken = async function (accessToken) {
  let result = await this.deleteOne({ accessToken: accessToken }).exec()

  return result
}

const _token = mongoose.model('Token', Token, 'Token')

module.exports = _token
