import { request, getArray, objectToArray } from '../../util/util.js';
Page({
  data: {
    phone:'',
    info:{},
  },
  onLoad:function(options){
    var that = this;
    request({
      url: 'demands/'+options.id,
      data: {
        id: options.id,
      },
      success: function(res) {
        if( res.data.code==0 ){
          console.log(res.data)
          that.setData({
            info: res.data.data,
            phone: res.data.data.phone,
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
