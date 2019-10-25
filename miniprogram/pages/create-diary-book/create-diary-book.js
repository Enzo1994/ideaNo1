// miniprogram/pages/create-diary-book/create-diary-book.js
// import crypto from 'crypto'
// console.log(crypto.createHash('sha256').update("Message").digest('hex'))
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: ""
  },
  chooseImages() {
    wx.chooseImage({
      count: 2,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        const FileSystemManager = wx.getFileSystemManager();
        const base64Images = [];
        res.tempFilePaths.forEach(tempUrl => {
          base64Images.push({
            suffix: /\.[^\.]+$/.exec(tempUrl)[0],
            base64: FileSystemManager.readFileSync(tempUrl, "base64"),
          })
        })

        console.log(base64Images)
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'upload',
          // 传递给云函数的event参数
          data: {
            images: base64Images
          }
        }).then(res => {
          console.log(res)
        }).catch(err => {
          // handle error
        })
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
      }
    })
  },
  formSubmit(form) {
    const {
      value
    } = form.detail;
    if (!value.sex) {
      wx.showToast({
        icon: "none",
        title: "请填写爱宠性别哦！"
      });
      return false;
    }
    console.log(value);
  },
  bindDateChange: function(e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    this.setData({
      date: e.detail.value
    });
  },
  
  test() {
    console.log(2);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});