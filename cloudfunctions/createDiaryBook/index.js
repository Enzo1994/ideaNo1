// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()


// 云函数入口函数
exports.main = async(event /*前台传过来的数据*/ , context) => {
  try {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();

    const fileStream = Buffer.from(event.petAvatar);
    const imageSaveResult = await cloud.uploadFile({
      cloudPath: 'avatarImages/' + wxContext.OPENID + '/'+event.diaryBookIndex+'.jpg',
      fileContent: fileStream,
    })
    const addResult = await db.collection('diary_book').add({
      data: {
        _openid: wxContext.OPENID,
        petAvatar: imageSaveResult.fileID, // 日记本（宠物）头像
        petName: event.petName, // 宠物昵称
        petGender: event.petGender, //宠物性别
        breed: event.breed, // 宠物品种
        meetDate: event.meetDate, // 第一次见面时间
        bodyLength: event.bodyLength, // 宠物身长
        weight: event.weight, // 宠物体重
        diaries: []
      }
    })
    return { addResult}

  } catch (e) {
    return e
  }

  // {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID

  // }
}