//app.js

// we-cropper init config:
import GlobalConfig from "./we-cropper/config/index";
const globalConfig = new GlobalConfig();
globalConfig.init();

App({
  onLaunch: function() {
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType;
        console.log(res);
      }
    });
    wx.onNetworkStatusChange(function(res) {
      console.log(res.isConnected);
      console.log(res.networkType);
    });
    this.globalData = {
      config: globalConfig, // we-cropper init config
      hasUser: false,
      userInfo: {},
      hasUserInfo: false,
      hasUnionid: false,
      StatusBar: 0,
      intervalInstance: null,
      diaryBookNum:0,
    };
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar =
          custom.bottom + custom.top - e.statusBarHeight;
      }
    });

    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: "youxin-d841c0",
        traceUser: true
      });
    }

    // ①去数据库查看是否已经存储了用户信息：
    const db = wx.cloud.database();
    const user = db
      .collection("user_public")
      .get()
      .then(res => {
        // ②查看用户是否授权：
        wx.getSetting({
          success: res => {
            if (res.authSetting["scope.userInfo"]) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // wx.cloud.callFunction({ name: "login" }).then(context => {
                  //   this.globalData.openid = context.result.openid;
                  // });
                  this.globalData.userInfo = res.userInfo;
                  this.globalData.hasUserInfo = true;
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res);
                  }
                },
                fail(e) {
                  wx.showModal({
                    title: "系统提示",
                    content: "获取信息失败：" + e.errMsg
                  });
                }
              });
            }
          },
          fail(e) {
            wx.showModal({
              title: "系统提示",
              content: "获取信息失败：" + e.errMsg
            });
          }
        });

        if (res.data.length != 0) {
          this.globalData.hasUser = true;
          if (!res.data[0].unionid) {
            console.log("未记录unionid");
            this.globalData.hasUnionid = false;
          }
        }
      })
      .catch(e => {
        wx.showModal({
          title: "系统提示",
          content: "获取信息失败：" + e
        });
      });
  }
});
