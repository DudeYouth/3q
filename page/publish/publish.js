import { request, objectToArray, getArray } from '../../util/util.js';
var data = wx.getStorageSync('all_data');
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
  toast1Tap: function () {
    wx.showToast({
      title: "发布成功"
    })
  }
})
