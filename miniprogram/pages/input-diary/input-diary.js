// miniprogram/pages/input-diary/input-diary.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diaryData: {
      media: '',
      imageUrls: [
        // {
        //   url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
        // },
        // {
        //   url: 'cloud://youxin-d841c0.796f-youxin-d841c0-1251546534/4656e81f6dc57c5.jpg'
        // }
      ]
    }
  },

  addImage: function () {
    const that = this;
    wx.chooseImage({
      count: 9 - this.data.diaryData.imageUrls.length,
      success: function (res) {
        const imageUrls = that.data.diaryData.imageUrls
        res.tempFilePaths.forEach(url => {
          wx.compressImage({
            src: url,
            quality: 50,
            success(tempFilePath) {
              console.log(tempFilePath.tempFilePath)

              imageUrls.push({
                url: tempFilePath.tempFilePath
              })


              that.setData({
                'diaryData.imageUrls': imageUrls
              })

            }
          })
        })


      },
    })
  },

  previewImage: function (e) {
    console.log(e.currentTarget.dataset.item.url)
    wx.previewImage({
      urls: this.data.diaryData.imageUrls.map(i => i.url),// 需要预览的图片http链接列表
      current: e.currentTarget.dataset.item.url, // 当前显示图片的http链接
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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