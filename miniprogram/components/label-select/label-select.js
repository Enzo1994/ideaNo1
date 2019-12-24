// miniprogram/components/lebel-select/label-select.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startPosition: 0,
    endPosition: 0,
    translatePosition: 0,
  },
  touchStart: function(e) {
    console.log(e, e.changedTouches[0].clientY)
    if(!this.data.startPosition){
    this.setData({
      startPosition: e.changedTouches[0].clientY,
    })
    }

  },
  touchMove: function(e) {
    // if (this.data.startPosition - e.changedTouches[0].clientY < 0) {
    this.setData({
      translatePosition: e.changedTouches[0].clientY - this.data.startPosition
    })
 

  },
  touchEnd: function(e) {
    // this.setData({
    //   endPosition: e.changedTouches[0].clientY,
    // startPosition: this.data.translatePosition

    // })
    var query = wx.createSelectorQuery()//创建节点查询器 query
    query.select('#labelContainer').boundingClientRect()
    query.exec(function (res) {
      console.log(res)

    })
    if(wx.createSelectorQuery('#labelContainer').offsetTop>(wx.getSystemInfoSync().windowHeight*4/5)){
      console.log(222)
    };  
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