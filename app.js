const openIdUrl = require('./config').openIdUrl
import { request, objectToArray, isEmptyObject } from './util/util.js';
App({
  globalData: {

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
      wx.checkSession({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              var info= wx.getStorageSync('userinfo');
              if( info ){
                console.log(info,7777);
                that.globalData.access_token = info.access_token;
                that.globalData.user_id = info.user_id;
                that.globalData.userInfo = res.userInfo;
                wx.redirectTo({
                  url: '/page/index/index',
                });
              }else{
                console.log(8888);
                that.onLogin();
              }

              //typeof cb == "function" && cb(that.globalData.userInfo)

            }
          })
        },
        fail: function () {
          //调用登录接口
          console.log(6666)
          that.onLogin();
        }
      })

    // }
  },
  // 检测授权状态
  checkSettingStatu: function (cb) {
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        console.log(res.authSetting);
        var authSetting = res.authSetting;
        if (isEmptyObject(authSetting)) {
          console.log('首次授权');
        } else {
          console.log('不是第一次授权', authSetting);
          // 没有授权的提醒
          if (authSetting['scope.userInfo'] === false) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用阅读记录功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                    success: function success(res) {
                      console.log('openSetting success', res.authSetting);
                    }
                  });
                }
              }
            })
          }
        }
      }
    });
  },
  onLogin:function(){
    var that = this;
    wx.login({
      success: function (result) {
        request({
          url: 'security/login',
          type: 'post',
          data: {
            code: result.code,
          },
          success: function (res) {
            console.log(res, result, 9999);
            var data = res.data.data;
            wx.setStorageSync('userinfo', data);
            console
            that.globalData.access_token = data.access_token;
            that.globalData.user_id = data.user_id;
            wx.getUserInfo({
              success: function (result) {
                that.globalData.userInfo = result.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
                wx.redirectTo({
                  url: '/page/index/index',
                });
              }
            })
          },
        })
      }
    })
  },
  onShow: function () {
    this.checkSettingStatu();
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
  getUserOpenId: function (callback) {
    var self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function (data) {
          wx.request({
            url: openIdUrl,
            data: {
              code: data.code
            },
            success: function (res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail: function (res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  }
})