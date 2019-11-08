// miniprogram/pages/input-diary/input-diary.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentBookId: '',
    imageUrls: [
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
      count: 9 - this.data.imageUrls.length,
      // sizeType: 'compressed',
      success: function(res) {
        const imageUrls = that.data.imageUrls
        res.tempFilePaths.forEach(url => {
          // wx.compressImage({
          //   src: url,
          //   quality: 50,
          //   success(tempFilePath) {
          //     console.log(tempFilePath.tempFilePath)

          // imageUrls.push({
          //   url: tempFilePath.tempFilePath
          // })

          imageUrls.push({
            url
          })
          console.log(imageUrls)
          that.setData({
            'imageUrls': imageUrls
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
  formSubmit: function(form) {
    const {
      value
    } = form.detail;
    console.log(value)
    this.data.imageUrls.forEach(url => {
      wx.getFileInfo({
        filePath: url,
        success: result => {
          console.log(result);
        },
        fail: () => {},
        complete: () => {}
      });
    })
    // wx.cloud.uploadFile({
    //   cloudPath:
    // })
    db.collection("diary_book").doc(this.data.currentBookId).update({
        data: {
          diaries: db.command.unshift([{postDate:{'$date':(new Date()/1)},...value}])

        }
      })
      // .update({

      // })
      .then(res => {
        console.log(res)
      })
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