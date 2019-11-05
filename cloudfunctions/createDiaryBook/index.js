// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event /*前台传过来的数据*/ , context) => {
  const wxContext = cloud.getWXContext()
  const fileStream = Buffer.from( event.petAvatar);
  const imageSaveResult = await cloud.uploadFile({
    cloudPath: 'avatarImages/' + wxContext.OPENID + '/1.jpg',
    fileContent: fileStream,
  })
  return imageSaveResult
  // {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID
  
  // }
}