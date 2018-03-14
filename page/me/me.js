//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    that.setData({
      userInfo: app.globalData.userInfo,
    })
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
  },
  tip:function(){
    wx.showToast({
      title: '功能正在开发中！',
      icon: 'none',
    })
  }
})