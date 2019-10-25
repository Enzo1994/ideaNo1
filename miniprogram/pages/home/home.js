// miniprogram/pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    diaryData: [{
      time: '2019年10月14日',
      media: 'image',
      count: 9,
      images: [{
          url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
        },
        {
          url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
        },
        {
          url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
        },
        {
          url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
        },
        {
          url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
        },
        {
          url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
        },
        {
          url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
        },
        {
          url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
        },
        {
          url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
        }
      ],
      desc: '这是一个测试语句'
    }]
  },

  onGetUserInfo:function(e){
    console.log(e)
    // 第一次登陆成功，登陆授权成功，接下来操作：
    // 1、 判断是否数据库有用户信息，如果有，更新，如果没有新建
    // 2、 判断是否存储用户unionid，如果有，pass，如果没有调用云函数getUnionid获取
    // 3、 再当前实例保存用户信息
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo

      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })

      this.addUser(app.globalData.userInfo)

      // wx.switchTab({ url: '/pages/index/index' })
    }
  },
  // 如果数据库没有此用户，则添加
  async addUser(user) {
    if (app.globalData.hasUser) {
      return
    }
    const db = wx.cloud.database()
    let result = await db.collection('user').add({
      data: {
        nickName: user.nickName,
        albums: []
      }
    })
    app.globalData.nickName = user.nickName
    app.globalData.id = result._id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(app.globalData.isLogin){
      this.setData({isLogin:true})
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})