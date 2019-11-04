// miniprogram/pages/diary-detail/diary-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceWidth:0,
    swiperHeight: 0,
    transition:false,
    imageUrls: ["./微信图片_20181229112456.jpg", "./pexels-photo-799443.jpeg", "./IMG_1942.jpg", ]
  },

  onSwiperChagne: function(e) {
    console.log(e)
    wx.getImageInfo({
      src: this.data.imageUrls[e.detail.current],
      success: (res) => {
        const swiperHeight = this.data.deviceWidth * res.height / res.width
        console.log(res)
        this.setData({
          swiperHeight,
          transition:true
        })
        console.log(swiperHeight)
      },
      fail() {
        wx.showModal({
          title: '系统提示',
          content: '网络错误请稍后重试',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({ deviceWidth: systemInfo.safeArea.width})
    wx.getImageInfo({
      src: this.data.imageUrls[0],
      success: (res) => {
        const swiperHeight = systemInfo.safeArea.width * res.height / res.width
        console.log(res)
        this.setData({
          swiperHeight: swiperHeight,
        })
        console.log(swiperHeight)
      },
      fail() {
        wx.showModal({
          title: '系统提示',
          content: '网络错误请稍后重试',
        })
      }
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