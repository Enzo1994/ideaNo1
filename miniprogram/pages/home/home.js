// miniprogram/pages/home/home.js
const app = getApp();
const db = wx.cloud.database();
const $ = db.command.aggregate;

const sleep = time => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const polling = function(pollingFunc, times, intervalLength) {
  let counter = 0;
  const interval = setInterval(() => {
    counter++;
    if (counter >= times) {
      clearInterval(interval);
    }
    pollingFunc();
  }, intervalLength);
  return interval;
};

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
    diaryBookInfo: [],
    swiperCurrentIndex: 0,
    showGuidePage: false
  },

  createDiaryBook: function() {
    wx.navigateTo({
      url: "../create-diary-book/create-diary-book"
    });
  },
  addDiary: function() {
    wx.navigateTo({
      url: "../input-diary/input-diary?_id=" + this.data.diaryBookInfo[this.data.swiperCurrentIndex]._id
    });
  },
  showDetail: function() {
    wx.navigateTo({
      url: "../diary-detail/diary-detail"
    });
  },
  getDiaryData: async function(isFirstRequest, isPull) {
    const currentBook = this.data.diaryBookInfo[this.data.swiperCurrentIndex];
    if (this.data.loadModal || (this.data.diaryBookInfo.length != 0 && currentBook.isGotAll)) {
      return
    }
    if (!isPull) {
      this.setData({
        loadModal: true
      });
    }
    if (isFirstRequest) {
      db.collection("diary_book").aggregate().match({
          _openid: app.globalData.openid
        }).project({
          breed: true,
          bodyLength: true,
          meetDate: true,
          petAvatar: true,
          petGender: true,
          petName: true,
          weight: true,
          diaries: $.slice(['$diaries', 5])
        }).end()
        .then(res => {
          res.list.forEach(bookItem => {
            bookItem.isGotAll = false;
            bookItem.diaries.forEach(item => {
              item.postDate = new Date(item.postDate) / 1;
            })
          })
          this.setData({
            diaryBookInfo: res.list,
            loadModal: false
          });
          wx.stopPullDownRefresh()

        });
    } else {
      const lastDate = new Date(currentBook.diaries.slice(-1)[0].postDate).toISOString()
      db.collection("diary_book").aggregate().match({
          _openid: app.globalData.openid
        }).skip(this.data.swiperCurrentIndex).limit(1).project({
          diaries: $.filter({
            input: '$diaries',
            as: 'item',
            cond: $.lt(['$$item.postDate', $.dateFromString({
              dateString: lastDate
            })])
          })
        })
        .project({
          diaries: $.slice(['$diaries', 0, 5])
        })
        .end()
        .then(res => {
          console.log(res)

          // if () {
          //   this.data.diaryBookInfo
          // }
          this.setData({
            ["diaryBookInfo[" + this.data.swiperCurrentIndex + "].isGotAll"]: res.list[0].diaries.length != 5 ? true : false,
            ["diaryBookInfo[" + this.data.swiperCurrentIndex + "].diaries"]: currentBook.diaries.concat(res.list[0].diaries.map(item => {
              item.postDate = new Date(item.postDate) / 1;
              return item;
            })),
            loadModal: false
          })
        });
    }

  },
  onchange(e) {
    const {
      current
    } = e.detail;
    this.setData({
      swiperCurrentIndex: current
    })
  },
  onGetUserInfo: function(e) {
    console.log(e);
    // 第一次登陆成功，登陆授权成功，接下来操作：
    // 1、 判断是否数据库有用户信息，如果有，更新，如果没有新建
    // 2、 判断是否存储用户unionid，如果有，pass，如果没有调用云函数getUnionid获取
    // 3、 再当前实例保存用户信息
    if (this.data.canIUse && e.detail.userInfo) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况

      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      this.addUser(app.globalData.userInfo);
      this.getDiaryData(true);
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        },
        fail(e) {
          wx.showModal({
            title: "温馨提示",
            content: "获取信息失败：" + e
          });
        }
      });
      this.addUser(app.globalData.userInfo);
      this.getDiaryData(true);
    }
  },

  /**
   * 如果数据库没有此用户，则添加
   **/
  async addUser(user) {
    if (app.globalData.hasUser) {
      this.setData({
        hasUser: true
      });
      return;
    }
    try {
      let result_public = await db.collection("user_public").add({
        data: {
          nickName: user.nickName,
          avatarUrl: user.avatarUrl,
          gender: user.gender,
          createTime: new Date() / 1
        }
      });
      let result_private = await db.collection("user_private").add({
        data: {
          userInfo: user,
          createTime: new Date() / 1
        }
      });
      if (
        result_private.errMsg == "collection.add:ok" &&
        result_public.errMsg == "collection.add:ok"
      ) {
        app.globalData.hasUser = true; // 保存到数据库以后就hasUser了
        this.setData({
          hasUser: true,
          showGuidePage: false
        });
        app.globalData.nickName = user.nickName;
        app.globalData.id = result_public._id;
      } else {
        wx.showModal({
          title: "温馨提示",
          content: "添加信息失败：result_private: " +
            result_private.errMsg +
            " , result_public: " +
            result_public.errMsg
        });
      }
    } catch (e) {
      wx.showModal({
        title: "温馨提示",
        content: "添加信息失败：" + e.errMsg
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    app.userInfoReadyCallback = res => {
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
        // hasUser: true
      });
    };
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: app.globalData.hasUserInfo,
      hasUser: app.globalData.hasUser
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 加个5次轮询以防网络延迟不显示引导页
    app.globalData.intervalInstance = polling(
      () => {
        console.log("这有五次轮询");
        this.setData({
          showGuidePage: !this.data.hasUserInfo
        });
      },
      5,
      1500
    );
    if (!this.data.hasUserInfo) {
      this.getDiaryData(true)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getDiaryData(true, true)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getDiaryData(false)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});