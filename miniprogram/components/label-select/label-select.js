// miniprogram/components/lebel-select/label-select.js
Component({

  /**
   * 页面的初始数据
   */
  data: {
    startPosition: 0,
    endPosition: 0,
    translatePosition: 0,
    hasTransition: false,
    containerHeight: 0
  },
  methods: {
    selectLabel(e){
      console.log(e)
    },
    touchStart: function(e) {
      console.log(e, e.changedTouches[0].clientY)
      this.setData({
        hasTransition: false
      })
      if (!this.data.startPosition) {
        this.setData({
          startPosition: e.changedTouches[0].clientY,
        })
      }

    },
    touchMove: function(e) {
      const translatePosition = e.changedTouches[0].clientY - this.data.startPosition;
      if (translatePosition < -this.data.containerHeight * 5.8/10) {
        console.log(11)
        this.setData({
          translatePosition: -this.data.containerHeight * 5.8 / 10
        })
        return
      }

      console.log(translatePosition)
      this.setData({
        translatePosition
      })


    },


    touchEnd: function(e) {
      this.setData({
        hasTransition: true
      })
      const translatePosition = e.changedTouches[0].clientY - this.data.startPosition;
      console.log(this.data.containerHeight)
      if (translatePosition < -this.data.containerHeight / 4) {
        this.triggerEvent('ontop', {})

        this.setData({
          translatePosition: -this.data.containerHeight * 5.8 / 10
        })
      }else{
        this.triggerEvent('onbottom', {})

        this.setData({
          translatePosition:0
        })

      }

    },
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      console.log(111)
      const query = wx.createSelectorQuery()
      query.select('#labelContainer').boundingClientRect()
      query.selectViewport().fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        properties: ['scrollX', 'scrollY'],
        computedStyle: ['margin', 'backgroundColor'],
        context: true,
      })
      query.exec((res) => {
        console.log(res, 3333)
        this.setData({
          containerHeight: res[1].height
        })
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  attached: function() {

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