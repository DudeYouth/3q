import { request, objectToArray, getArray } from '../../util/util.js';
var app = getApp();

Page({
  data: {
    focus: false,
    index: 0,
    data:{},
    demandTypeIndex: 0,
    demandType: [],
    
    SubjectTypeIndex: 0,
    SubjectType: [],

    gradeTypeIndex: 0,
    gradeType: [],
    priceType: [],
    priceTypeIndex: 0,
    provinces: [],
    citys: [],
    areas: [],
    province:'',
    city:'',
    area:'',
    areaSelect:[0,0,0],
    areaShow:false,
    confirmShow:false,
    phone:'',
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
  closeConfirmModel:function(){
    this.setData({
      confirmShow: false,
    })
  },
  onLoad:function(){
    var that = this;
    var data = wx.getStorageSync('all_data');
    var infinite = {
      id:0,
      name:''
    };
    this.setData({
      data:data,
      demandType: data.type.unshift({}),
      SubjectType: data.subject,
      gradeType: data.grade,
      priceType: data.salary,
      provinces: getArray(data.district),
      citys: getArray(data.district[0].children),
      areas: getArray(data.district[0].children[0].children),
    });
    request({
      url: 'users/' + app.globalData.user_id+'/phone',
      header:{
        Token: app.globalData.access_token,
      },
      success: function(res) {
        var data = res.data;
        if( data.code==0 ){
          that.setData({
            phone:data.data.phone,
          });
        }else{
          that.setData({
            confirmShow: true,
          });    
        }
      },
    })
  },
  copyPhoneNumber:function(){
    this.setData({
      wechat:this.data.phone,
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    if (e.detail.errMsg) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      that.setData({
        phone: 12345678912,
      });
    }
  },
  formBindsubmit:function(e){
    var value = e.detail.value;
    var data = this.data.data;
    var province = data.district[this.data.areaSelect[0]];
    var city = province.children[this.data.areaSelect[1]];
    var area = {};
    if (city.children&&city.children.length ){
      area = city.children[this.data.areaSelect[2]];
    }

    var param = {
      address: value.address,
      note: value.note,
      wechat: value.wechat,
      phone: value.phone,
      show_contact: value.show_contact,
      type: this.data.demandType[this.data.demandTypeIndex].id,
      grade: this.data.gradeType[this.data.gradeTypeIndex].id,
      subject: this.data.SubjectType[this.data.SubjectTypeIndex].id,
      salary: this.data.priceType[this.data.priceTypeIndex].id,
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
  confirm: function () {
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
    var data = this.data.data;
    var province = data.district[selects[0]];
    var provinceId = province.id;
    var city = province.children;
    var cityId = city[selects[1]].id;
    var area = city[selects[1]].children;
    var areaId = (area[selects[2]] && area[selects[2]].id) || 0;
    this.setData({
      areaSelect:selects,
      citys: getArray(city),
      areas: getArray(area),
    })
  },
})
