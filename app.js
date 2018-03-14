const openIdUrl = require('./config').openIdUrl
import { request, objectToArray } from './util/util.js';
App({
  globalData:{

  },
  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取
    request({
      url: 'filters',
      success: function (res) {
        var data = res.data.data;
        wx.setStorageSync('all_data', res.data.data);
      }
    });
    this.getUserInfo();
  },
  getUserInfo: function (cb) {
    var that = this
    // if (this.globalData.userInfo) {
    //   typeof cb == "function" && cb(this.globalData.userInfo)
    // } else {
      //调用登录接口
      wx.login({
        success: function (result) {
          request({
            url: 'security/login',
            type:'post',
            data:{
              code: result.code,
            },
            success: function(res) {
              var data = res.data.data;
              that.globalData.access_token = data.access_token;
              that.globalData.user_id = data.user_id;
            },
          })
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
              wx.redirectTo({
                url: '/page/index/index',
              });
            }
          })
        }
      })
    // }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    userInfo: null,
    hasLogin: false,
    openid: null
  },

  // lazy loading openid
  getUserOpenId: function(callback) {
    var self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function(data) {
          wx.request({
            url: openIdUrl,
            data: {
              code: data.code
            },
            success: function(res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail: function(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail: function(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  }
})