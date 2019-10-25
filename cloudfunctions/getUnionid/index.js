// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 此函数获取并保存用户unionid
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  cloud.database().collection('user')
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}