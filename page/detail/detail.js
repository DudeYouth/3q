Page({
  data: {
    phone:'123456789'
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '12345678900', //此号码并非真实电话号码，仅用于测试  
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
