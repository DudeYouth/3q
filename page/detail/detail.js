import { request, getArray, objectToArray } from '../../util/util.js';
var app = getApp();
Page({
  data: {
    phone:'',
    info:{},
    grant: false,
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e, 123)
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      request({
        url: 'security/verify',
        type: 'post',
        data: {
          data: e.detail.encryptedData,
          iv: e.detail.iv,
        },
        header: {
          Token: app.globalData.access_token,
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 0)
            wx.navigateTo({ url: '/page/publish/publish?phone=' + res.data.data.phoneNumber })
        },
      })
    }
  },
  navigateTo: function () {
    wx.navigateTo({ url: '/page/publish/publish' })
  },
  onLoad:function(options){
    var that = this;
    request({
      url: 'users/' + app.globalData.user_id + '/phone',
      header: {
        Token: app.globalData.access_token,
      },
      success: function (res) {
        console.log(res)
        if (!res.data.data.phone) {
          that.setData({
            grant: true
          });
        }
      }
    });
    request({
      url: 'demands/'+options.id,
      data: {
        id: options.id,
      },
      success: function(res) {
        if( res.data.code==0 ){
          var phone = res.data.data.phone;
          res.data.data.phone = phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
          res.data.data.wechat = res.data.data.wechat.replace(/([A-Za-z0-9_]+?)[A-Za-z0-9_]{4}$/, "$1****");
          that.setData({
            info: res.data.data,
            phone: phone,
          })
        }

      },
    })
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phone, //此号码并非真实电话号码，仅用于测试  
      success: function () {
        wx.showToast({
          title: "拨号成功！",
        });
      },
      fail: function () {
        wx.showToast({
          title: "拨号失败！",
        });
      }
    })
  },
  copyPhoneNumber:function(){
    wx.setClipboardData({
      data: this.data.phone,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: "复制成功！",
            });
          },
          fail: function () {
            wx.showToast({
              icon:"none",
              title: "复制失败！",
            });
          }
        })
      }
    })
  }
})
