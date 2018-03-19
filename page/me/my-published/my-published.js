import { request, objectToArray, getArray } from '../../../util/util.js';
var app = getApp();
Page({
  data: {
    lists: [],
    scrollTop: 0,
    winH: 480,
    page: 1,
    perPage: 10,
  },
  toast1Tap: function () {
    wx.showToast({
      title: "标记成功"
    })
  },
  scrollTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  onReachBottom: (function (e) {
    var timer = null;
    return function () {
      var that = this;
      if (!timer) {
        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 1500
        })
        timer = setTimeout(function () {
          clearTimeout(timer);
          timer = 0;
          that.demands();
        }, 600);

      }
    }

  })(),
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        this.setData({
          winH: res.windowHeight
        });
      }
    });
    this.demands();
  },
  demands:function(){
    var that = this;
    var param = {};
    param['id'] = app.globalData.user_id;
    param['page'] = this.data.page;
    param['per-page'] = this.data.perPage;
    this.setData({
      page: this.data.page + 1,
    });
    request({
      url: 'users/' + app.globalData.user_id + '/demands',
      data: param,
      header: {
        Token: app.globalData.access_token,
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          res.data.data.items.forEach(function (value) {
            that.data.lists.push(value);
          });
          that.setData({
            lists: that.data.lists
          })
        }
      },
    })
  }
})
