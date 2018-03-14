var demandType = ['all', 'd1', 'd2']
var SubjectType = ['all', 'replied', 'unreply']
var gradeType = ['all', 'g1', 'g2', 'g3']
import { request, getArray, objectToArray} from '../../util/util.js';

Page({
  data: {
    provinces:[],
    citys:[],
    province:0,
    city:0,
    index: 0,
    lists:[],
    areaSelect:[0,0,0],
    areaSelectId:[0,0,0],
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
    var that = this;
    var selects = this.data.areaSelect;
    var province = this.data.district[selects[0]];
    var provinceId = province.id;
    var city = province.children;
    var cityId = city[selects[1]].id;
    request({
      url: 'demands',
      data: {
        type: this.data.demandType[this.data.demandTypeIndex].id,
        subject: this.data.SubjectType[this.data.SubjectTypeIndex].id,
        grade: this.data.gradeType[this.data.gradeTypeIndex].id,
        province: provinceId,
        city: cityId,
      },
      success: function (res) {
        if( res.data.code==0 ){
          that.setData({
            lists:res.data.data.items
          })
        }
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
    var provinceName = province.name;
    var city = province.children;
    var cityName = city[selects[1]].name;
    this.setData({
      province: provinceName,
      city: cityName.substring(0,3),
      areaSelect: selects,
      citys: getArray(city),
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
    var city = district[_this.data.areaSelect[0]].children;
    console.log([].slice.call(data.type))
    _this.setData({
      district: district,
      provinces: getArray(district),
      citys: getArray(city),
      demandType: data.type,
      SubjectType: data.subject,
      gradeType: data.grade
      })
    this.demands();
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

