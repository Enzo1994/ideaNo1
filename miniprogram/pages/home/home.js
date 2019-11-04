// miniprogram/pages/home/home.js
const app = getApp()

const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time);
  })
}

const polling = function (pollingFunc, times, intervalLength) {
  let counter = 0;
  const interval = setInterval(() => {
    counter++;
    if (counter >= times) {
      clearInterval(interval)
    }
    pollingFunc()
  }, intervalLength)
  return interval;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    hasUser: false,
    loadModal: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    diaryData: [],
    showGuidePage: false
  },


  createDiaryBook: function () {
    wx.navigateTo({
      url: '../create-diary-book/create-diary-book'
    })
  },
  addDiary: function () {
    wx.navigateTo({
      url: '../input-diary/input-diary',
    })
  },
  showDetail: function () {
    wx.navigateTo({
      url: '../diary-detail/diary-detail'
    })
  },
  getDiaryData: async function () {
    this.setData({
      loadModal: true
    })
    const diaryData = [{
      time: new Date() / 1,
      media: 'image',
      count: 9,
      images: [{
        url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
      },
      {
        url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/20170917123307_xAntK.jpg'
      },
      {
        url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/23749190.jpg'
      },
      {
        url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/u=2175847793,3699753666&fm=26&gp=0.jpg'
      },
      {
        url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/ae47faedab64034f0f457ad1a3c3793108551d9d.jpg'
      },
      {
        url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
      },
      {
        url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/NMSNext10-700x394.png'
      },
      {
        url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/potw1930a.jpg'
      },
      {
        url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/G42_RainbowGalaxyVoyagers-1075x675.jpg'
      }
      ],
      desc: '这是第一次，我家的铲屎官走了这么久。久到足足有三天！！ 在听到他的脚步声响在楼梯间的那一刻，我简直想要破门而出，对着他狠狠地吼上10分钟，然后再看心情要不要他进门。'
    }]
    await sleep(1000)
    this.setData({
      diaryData,
      loadModal: false
    })
  },

  onGetUserInfo: function (e) {
    console.log(e)
    // 第一次登陆成功，登陆授权成功，接下来操作：
    // 1、 判断是否数据库有用户信息，如果有，更新，如果没有新建
    // 2、 判断是否存储用户unionid，如果有，pass，如果没有调用云函数getUnionid获取
    // 3、 再当前实例保存用户信息
    if (this.data.canIUse && e.detail.userInfo) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况

      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.addUser(app.globalData.userInfo)
      this.getDiaryData()

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

  /**
   * 如果数据库没有此用户，则添加
   **/
  async addUser(user) {
    if (app.globalData.hasUser) {
      this.setData({
        hasUser: true
      })
      return
    }
    const db = wx.cloud.database()
    try {
      let result = await db.collection('user_public').add({
        data: {
          nickName: user.nickName,
          avatarUrl: user.avatarUrl,
          gender: user.gender,
          timeStamp: new Date() / 1
        }
      })

      app.globalData.hasUser = true; // 保存到数据库以后就hasUser了
      app.globalData.nickName = user.nickName
      app.globalData.id = result._id
      console.log(result)

    } catch (e) {
      console.log(e)
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    // 宠物头像：
    let { avatar } = option
    if (avatar) {
      this.setData({
        src: avatar
      })
    }

    app.userInfoReadyCallback = res => {
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true,
        // hasUser: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.hasUserInfo) {
      console.log(app.globalData)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        // hasUser: true
      })

    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDiaryData()
    // 加个5次轮询以防网络延迟不显示引导页
    app.globalData.intervalInstance = polling(() => {
      console.log('这有五次轮询')
      if (!this.data.hasUserInfo) {
        this.setData({
          showGuidePage: true
        })
      }
    }, 5, 1000)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})