import { request, objectToArray, getArray } from '../../../util/util.js';
var app = getApp();
Page({
  data: {
    lists:[],
  },
  toast1Tap: function () {
    wx.showToast({
      title: "标记成功"
    })
  },
  onLoad:function(){
    var that = this;
      request({
        url: 'users/' + app.globalData.user_id + '/demands',
        data:{
          id: app.globalData.user_id
        },
        header: {
          Token: app.globalData.access_token,
        },
        success: function (res) {
          console.log(res)
          if( res.data.code==0 ){
            that.setData({
              lists: res.data.data.items
            })
          }
        },
      })
  }
})
