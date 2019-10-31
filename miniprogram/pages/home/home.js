// miniprogram/pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    hasUser: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
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



  onGetUserInfo: function(e) {
    console.log(e)
    // 第一次登陆成功，登陆授权成功，接下来操作：
    // 1、 判断是否数据库有用户信息，如果有，更新，如果没有新建
    // 2、 判断是否存储用户unionid，如果有，pass，如果没有调用云函数getUnionid获取
    // 3、 再当前实例保存用户信息
    if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
     
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.addUser(app.globalData.userInfo)

    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo

          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      this.addUser(app.globalData.userInfo)

    }



  },

  // 如果数据库没有此用户，则添加
  async addUser(user) {
    if (app.globalData.hasUser) {
      this.setData({
        hasUser: true
      })
      return
    }
    const db = wx.cloud.database()
    let result = await db.collection('user').add({
      data: {
        nickName: user.nickName,
        timeStamp: new Date()
      }
    })
    app.globalData.nickName = user.nickName
    app.globalData.id = result._id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    app.userInfoReadyCallback = res => {
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true,
        hasUser: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    console.log(JSON.stringify(app.globalData))

    if (app.globalData.hasUserInfo) {
      console.log(app.globalData)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        hasUser: true
      })
    }
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