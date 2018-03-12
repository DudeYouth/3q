import { request, objectToArray, getArray } from '../../util/util.js';
var app = getApp();
var data = wx.getStorageSync('all_data');
console.log(data);
Page({
  data: {
    focus: false,
    index: 0,

    demandTypeIndex: 0,
    demandType: objectToArray(data.type),
    
    SubjectTypeIndex: 0,
    SubjectType: objectToArray(data.subject),

    gradeTypeIndex: 0,
    gradeType: objectToArray(data.grade),
    priceType: objectToArray(data.salary),
    priceTypeIndex: 0,
    provinces: getArray(data.district),
    citys: getArray(data.district[0].children),
    areas: getArray(data.district[0].children[0].children),
    province:'',
    city:'',
    area:'',
    areaSelect:[0,0,0],
    areaShow:false,
  },
  areaChange: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "ease",
      transformOrigin: '0',
    });
    animation.height(300).step();
    this.setData({
      areaShow: true,
    });
    this.setData({
      animationData: animation.export(),
    })
  },
  closeModal: function (e) {
    this.setData({
      areaShow: false,
      areaHeight: 0,
    })
  },
  onLoad:function(){


  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) { }
      })
    }
  },
  formBindsubmit:function(e){
    var value = e.detail.value;
    var province = data.district[this.data.areaSelect[0]];
    var city = province.children[this.data.areaSelect[1]];
    var area = {};
    if (city.children&&city.children.length ){
      area = city.children[this.data.areaSelect[2]];
    }
    console.log(app.globalData.access_token,123)
    var param = {
      address: value.address,
      note: value.note,
      wechat: value.wechat,
      phone: value.phone,
      show_contact: value.show_contact,
      type: this.data.demandTypeIndex,
      grade: this.data.gradeTypeIndex,
      subject: this.data.SubjectTypeIndex,
      salary: this.data.priceTypeIndex,
      province_id: province.id ,
      city_id:city.id,
      district_id:area.id||0,
    };
    request({
      url: 'demands',
      type:'post',
      header:{
        Token: app.globalData.access_token
      },
      data:param,
      success:function(res){
        var message = '发布成功！';
        var data = res.data;
        var icon = 'success';
        if (data.code==422 ){
          icon = "none";
          message = data.data[0].message;
        }else{
          setTimeout(function () {
            wx.redirectTo({
              url: '/page/index/index',
            });
          }, 1000);
        }
        wx.showToast({
          title: message,
          icon: icon,
        });
      }
      });
  },
  demands: function () {
    request({
      url: 'demands',
      data: {
        type: this.data.demandTypeIndex,
        subject: this.data.SubjectTypeIndex,
        grade: this.data.gradeTypeIndex,
        province: this.data.areaSelect[0],
        city: this.data.areaSelect[1],
        district: this.data.areaSelect[2],
      },
      success: function () {

      }
    });
  },
  confirm: function () {
    this.demands();
    this.closeModal();
  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  }, 
  demandTypeChange: function (e) {
    this.setData({
      demandTypeIndex: e.detail.value
    })
  },
  SubjectTypeChange: function (e) {
    this.setData({
      SubjectTypeIndex: e.detail.value
    })
  },
  gradeTypeChange: function (e) {
    this.setData({
      gradeTypeIndex: e.detail.value
    })
  },
  priceTypeChange: function (e) {
    this.setData({
      priceTypeIndex: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    var selects = e.detail.value;
    console.log(selects);
    var province = data.district[selects[0]];
    var provinceId = province.id;
    var city = province.children;
    var cityId = city[selects[1]].id;
    var area = city[selects[1]].children;
    var areaId = (area[selects[2]] && area[selects[2]].id) || 0;
    this.setData({
      citys: getArray(city),
      areas: getArray(area),
    })
  },
})
