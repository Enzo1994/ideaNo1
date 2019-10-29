//app.js
App({

  onLaunch: async function() {

    this.globalData = {
      hasUser: false,
      userInfo: {},
      hasUserInfo: false,
      hasUnionid: false,
      isLogin: false,
      StatusBar:0
    }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })


    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'youxin-d841c0',
        traceUser: true,
      })
    }



    // ①查看用户是否授权：
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;
              this.globalData.hasUserInfo = true;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // // ②去数据库查看是否已经存储了用户信息：
    const db = wx.cloud.database()
    const user = db.collection('user').get().then(res => {
      if (res.data.length != 0) {
        this.globalData.hasUser = true;
        if (!res.data[0].unionid) {
          console.log('未记录unionid')
          this.globalData.hasUnionid = false;
        }
      }
      console.log(res)
    });


  }
})