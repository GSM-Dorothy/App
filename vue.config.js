module.exports = {
  'transpileDependencies': [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'com.electron.dorothy',
        productName: 'Dorothy',
        publish: 'github'
      }
    }
  }
}
