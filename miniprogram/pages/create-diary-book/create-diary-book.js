// miniprogram/pages/create-diary-book/create-diary-book.js
// import crypto from 'crypto'
// console.log(crypto.createHash('sha256').update("Message").digest('hex'))
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    _id:'',
    date: "",
    index: null,
    gender:0,
    avatarUrl: "",
    isModify:false,
    isImageModify:false,
    diaryBookIndex:0,
    buttonDisabled:false
  },
  chooseAvatar: function() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0];
        wx.navigateTo({
          url: `./cut-image/cut-image?src=${src}`
        });
      }
    });
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    });
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },
  chooseImages() {
    wx.chooseImage({
      count: 2,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success(res) {
        console.log(res);
        const FileSystemManager = wx.getFileSystemManager();
        const base64Images = [];
        res.tempFilePaths.forEach(tempUrl => {
          base64Images.push({
            suffix: /\.[^\.]+$/.exec(tempUrl)[0],
            base64: FileSystemManager.readFileSync(tempUrl, "base64")
          });
        });

        console.log(base64Images);
        wx.cloud
          .callFunction({
            // 要调用的云函数名称
            name: "upload",
            // 传递给云函数的event参数
            data: {
              images: base64Images
            }
          })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            // handle error
          });
        console.log(res);
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
      }
    });
  },
  formSubmit(form) {
    this.setData({
      buttonDisabled:true,
    })
    wx.showToast({
      title: '提交中...',
      mask: true,
      icon:'loading',
      duration:20000
    })
    const { value } = form.detail;
    // if (!value.sex) {
    //   wx.showToast({
    //     icon: "none",
    //     title: "请填写爱宠性别哦！"
    //   });
    //   return false;
    // }

    // wx.compressImage({
    //   src: this.data.avatarUrl,
    //   quality: 50,
    //   success(res) {
    //     const fileManager = wx.getFileSystemManager();
    //     const avatarBuffer = fileManager.readFileSync(res.tempFilePath);
    //     wx.cloud
    //       .callFunction({
    //         name: "createDiaryBook",
    //         data: {
    //           petAvater: avatarBuffer,
    //           petName: "", // 宠物昵称
    //           petGender: 0, //宠物性别
    //           petBreed: "", // 宠物品种
    //           meetDate: 0, // 第一次见面时间
    //           petLength: 0, // 宠物身长
    //           petweight: 0 // 宠物体重
    //         }
    //       })
    //       .then(res => {
    //         console.log(res);
    //       });
    //   }
    // });
    if(this.data.isImageModify){
      var fileManager = wx.getFileSystemManager();
      var avatarBuffer = fileManager.readFileSync(this.data.avatarUrl);
    }
    wx.cloud
      .callFunction({
        name: "createDiaryBook",
        data: { _id:this.data._id, petAvatar: avatarBuffer, ...value,diaryBookIndex:app.globalData.diaryBookNum+1,isModify:this.data.isModify,isImageModify:this.data.isImageModify,bookIndex:this.data.diaryBookIndex }
      })
      .then(res => {
        if (res.errMsg == "cloud.callFunction:ok" && res.result.addResult.errMsg =="document.update:ok"){
          wx.hideToast();
          wx.showToast({
            title: '修改成功',
            icon:'success',
            mask:true,
          })
          wx.navigateBack({
            delta:1
          })
        }
        console.log(res);
      })
      .catch(e => {
        e = e.indexOf('network offline') != -1 ? '请检查网络连接' : e;
        wx.hideToast()
        wx.showModal({
          title: "系统提示",
          content: "添加信息失败：" + e
        });
      });
    // wx.getFileInfo({
    //   filePath: this.data.avatarUrl,
    //   success: result => {
    //     console.log(result);
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });
    // wx.compressImage({
    //   src: this.data.avatarUrl, // src:
    //   //   "http://tmp/wx7b6f160a492b0b57.o6zAJs2loXSzW3D8ugdiJv7RHC8w.tH85VTySbFiE2652d213c54fd4def0f7841bd891e313.png",
    //   quality: 10,
    //   success(res) {
    //     wx.getFileInfo({
    //       filePath: res.tempFilePath,
    //       success: result => {
    //         console.log(result);
    //         wx.previewImage({
    //           current: res.tempFilePath,
    //           urls: [res.tempFilePath],
    //           success: result => {},
    //           fail: () => {},
    //           complete: () => {}
    //         });
    //       },
    //       fail: () => {},
    //       complete: () => {}
    //     });
    //   }
    // });

    // wx.cloud
    //   .uploadFile({
    //     cloudPath: "avatarImages/" ,
    //     filePath: "" // 文件路径
    //   })
    //   .then(res => {
    //     // get resource ID
    //     console.log(res.fileID);
    //   })
    //   .catch(error => {
    //     // handle error
    //   });
    // wx.cloud.collection("diaryBook").add({
    //   data: {
    //     petAvaterUrl: "", // 宠物头像
    //     petName: "", // 宠物昵称
    //     petGender: 0, //宠物性别
    //     petBreed: "", // 宠物品种
    //     meetDate: 0, // 第一次见面时间
    //     petLength: 0, // 宠物身长
    //     petweight: 0 // 宠物体重
    //   }
    // });
  },
  bindDateChange: function(e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    this.setData({
      date: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.on('deliveryData', diaryBookInfo=>{
      this.setData({
        _id: diaryBookInfo.data._id,
        bodyLength:diaryBookInfo.data.bodyLength,
        breed: diaryBookInfo.data.breed,
        date: diaryBookInfo.data.meetDate,
        avatarUrl: diaryBookInfo.data.petAvatar,
        gender: diaryBookInfo.data.petGender,
        petName: diaryBookInfo.data.petName,
        weight: diaryBookInfo.data.weight,
        isModify:true,
        diaryBookIndex:diaryBookInfo.diaryBookIndex
      })
    })
    let { avatar } = options;
    if (avatar) {
      console.log(avatar);
      this.setData({
        avatarUrl: avatar
      });
    }
  },

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
