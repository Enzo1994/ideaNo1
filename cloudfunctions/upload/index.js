const cloud = require('wx-server-sdk')
const crypto = require("crypto")

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const toHash = (content) => {
  return crypto.createHash('sha256').update(content).digest('hex')
}

exports.main = async(event, context) => {
  // const dbResult = await cloud.database().collection('test').get()


  try {
    const promiseQueue = [];
    event.images.forEach(images => {
      const buf = Buffer.from(images.base64, 'base64');
      promiseQueue.push(cloud.uploadFile({
        cloudPath: toHash(images.base64) + images.suffix,
        fileContent: buf
      }))
    })
    return await Promise.all(promiseQueue)
  } catch (e) {
    return e
  }
}