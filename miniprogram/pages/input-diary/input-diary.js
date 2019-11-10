// miniprogram/pages/input-diary/input-diary.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitDisabled: false,
    currentBookId: '',
    mediaContent: [
      // {
      //   url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
      // },
      // {
      //   url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
      // }
    ]

  },

  addImage: function() {
    const that = this;
    wx.chooseImage({
      count: 9 - this.data.mediaContent.length,
      sizeType: 'compressed',
      success: function(res) {
        const mediaContent = that.data.mediaContent
        res.tempFilePaths.forEach(url => {
          // wx.compressImage({
          //   src: url,
          //   quality: 50,
          //   success(tempFilePath) {
          //     console.log(tempFilePath.tempFilePath)

          // mediaContent.push({
          //   url: tempFilePath.tempFilePath
          // })


          mediaContent.push({
            url
          })
          console.log(mediaContent)
          that.setData({
            mediaContent: mediaContent
          })

          // }
          // })
        })


      },
    })
  },

  previewImage: function(e) {
    console.log(e.currentTarget.dataset.item.url)
    wx.previewImage({
      urls: this.data.imageUrls.map(i => i.url), // 需要预览的图片http链接列表
      current: e.currentTarget.dataset.item.url, // 当前显示图片的http链接
    })
  },

  /**
   *  提交日记：
   */
  formSubmit: async function(form) {
    this.setData({
      submitDisabled: true
    })
    const {
      value
    } = form.detail;
    console.log(value)
    const fileIDs = []
    for (let [key, value] of Object.entries(this.data.mediaContent)) {
      const {
        fileID
      } = await wx.cloud.uploadFile({
        cloudPath: 'diaryContentImages/' + new Date() / 1+'.jpg',
          filePath: value.url, // 文件路径
      })
      fileIDs.push(fileID)
    }
    this.data.mediaContent.forEach(async item => {
      // wx.getFileInfo({
      //   filePath: item.url,
      //   success: result => {
      //     console.log(result);
      //   },
      //   fail: () => {},
      //   complete: () => {}
      // });

    })
    const res = await db.collection("diary_book").doc(this.data.currentBookId).update({
      data: {
        diaries: db.command.unshift([{
          postDate: {
            '$date': (new Date() / 1)
          },
          mediaContent: fileIDs,
          ...value
        }])
      }
    })
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    prevPage.getDiaryData(true)
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      currentBookId: options._id
    })
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