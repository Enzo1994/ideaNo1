// miniprogram/components/guide-page/gide-page.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPart: 1,
    hidden: false,
    animationData: {},
    animationData1: {},
    animationData2: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    console.log(111)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(111)

  },
  tap: function() {
    if(app.globalData.intervalInstance!=null){
      clearInterval(app.globalData.intervalInstance)
    }
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation

    if (this.data.showPart == 2) {
      animation.height(0).opacity(0).step()
      this.setData({
        animationData: animation.export()
      })
      return
    }


    animation.opacity(1).step()

    this.setData({
      showPart: 2,
      animationData2: animation.export()
    })
    animation.opacity(0).scale(1.5,1.5).step()

    this.setData({
      animationData1: animation.export()
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})