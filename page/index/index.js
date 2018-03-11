var demandType = ['all', 'd1', 'd2']
var SubjectType = ['all', 'replied', 'unreply']
var gradeType = ['all', 'g1', 'g2', 'g3']
import { request, getArray, objectToArray} from '../../util/util.js';

Page({
  data: {
    provinces:[],
    citys:[],
    areas:[],
    province:0,
    city:0,
    area:0,
    index: 0,
    areaSelect:[0,0,0],
    areaSelectId:[],
    demandTypeIndex: 0,
    demandType: [],
    animationData:'',
    SubjectTypeIndex: 0,
    SubjectType: [],

    gradeTypeIndex: 0,
    gradeType: [],
    district:[],
    areaShow:false,
    areaHeight:0,
  },
  areaChange:function(){
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
      areaShow:false,
      areaHeight:0,
    })
  },
  demands:function(){
    request({
      url: 'demands',
      data: {
        type: this.data.demandTypeIndex,
        subject: this.data.SubjectTypeIndex,
        grade: this.data.gradeTypeIndex,
        province: this.data.areaSelectId[0],
        city: this.data.areaSelectId[1],
        district: this.data.areaSelectId[2],
      },
      success: function () {

      }
    });
  },
  confirm:function(){
    this.demands();
    this.closeModal();
  },
  bindPickerChange: function (e) {
    var selects = e.detail.value;
    var province = this.data.district[selects[0]];
    var provinceId = province.id;
    var provinceName = province.name;
    var city = province.children;
    var cityId = city[selects[1]].id;
    var cityName = city[selects[1]].name;
    var area = city[selects[1]].children;
    var areaId = (area[selects[2]]&&area[selects[2]].id)||0;
    var areaName = (area[selects[2]] && area[selects[2]].name) || '';
    this.setData({
      province: provinceName,
      city: cityName,
      area:areaName,
      areaSelectId: [provinceId, cityId, areaId],
      citys: getArray(city),
      areas: getArray(area),
    })
  },
  demandTypeChange: function (e) {
    this.setData({
      demandTypeIndex: e.detail.value
    });
    this.demands();
  },
  SubjectTypeChange: function (e) {
    this.setData({
      SubjectTypeIndex: e.detail.value
    });
    this.demands();
  },

  onLoad:function(e){

    var _this = this;
    var data = wx.getStorageSync('all_data');
    var district = data.district;
    var city = district[_this.data.province].children;
    var area = city[_this.data.city].children;
    console.log([].slice.call(data.type))
    _this.setData({
      district: district,
      provinces: getArray(district),
      citys: getArray(city),
      areas: getArray(area),
      demandType: objectToArray(data.type),
      SubjectType: objectToArray(data.subject),
      gradeType: objectToArray(data.grade)
      })
  },

  gradeTypeChange: function (e) {
    this.setData({
      gradeTypeIndex: e.detail.value
    });
    this.demands();
  },
  navigateTo: function () {
    wx.navigateTo({ url: '/page/publish/publish' })
  }
})

