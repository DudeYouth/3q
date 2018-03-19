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
    placeholder: '输入其他补充说明',
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
    switchStatus:true,
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
  onLoad:function(options){
    console.log(options)
    var that = this;
    var data = wx.getStorageSync('all_data');
    var infinite = {
      id:0,
      name:''
    };
    data.district.unshift({ 'id': 0, 'name': '区域' });
    var province = getArray(data.district);
    data.type.unshift({ 'id': 0, 'name': '请选择需求' });
    data.subject.unshift({ 'id': 0, 'name': '请选择科目' });
    data.grade.unshift({ 'id': 0, 'name': '请选择年级' });
    data.salary.unshift({ 'id': 0, 'name': '请选择课酬' });
    this.setData({
      data:data,
      city:'',
      demandType: data.type,
      SubjectType: data.subject,
      gradeType: data.grade,
      priceType: data.salary,
      provinces: province,
      citys: getArray(data.district[0].children),
      areas: getArray(data.district[0].children ? data.district[1].children[0].children:[]),
    });
    request({
      url: 'users/' + app.globalData.user_id+'/phone',
      header:{
        Token: app.globalData.access_token,
      },
      success: function(res) {
        var data = res.data;
        console.log(res,123456);
        if (data.data.phone ){
          that.setData({
            phone:data.data.phone,
          });
        }else{
          that.setData({
            phone: options.phone,
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

  formBindsubmit:function(e){
    var value = e.detail.value;
    var data = this.data.data;
    var province = data.district[this.data.areaSelect[0]];
    var city = province.children?province.children[this.data.areaSelect[1]]:0;
    var area = {};
    if (city.children&&city.children.length ){
      area = city.children[this.data.areaSelect[2]];
    }
    var tip = '';
    var demandType = this.data.demandType[this.data.demandTypeIndex];
    var gradeType = this.data.gradeType[this.data.gradeTypeIndex];
    var SubjectType = this.data.SubjectType[this.data.SubjectTypeIndex];
    var priceType = this.data.priceType[this.data.priceTypeIndex];
    var reg = /^((\S)\1+|\d+|[^0-9a-zA-Z\u4e00-\u9fa5]+|\S{1,4})$/;
    if ( !value.note.length ){
      tip = "请输入其他补充说明";
    }
    if (reg.test(value.note) ){
      tip = "其他的内容不符合规范，请重新输入";
    }
    if (!value.address.length) {
      tip = "请输入详细地址";
    }
    if (reg.test(value.address)) {
      tip = "地址的内容不符合规范，请重新输入";
    }
    if (province.id==0 ){
      tip ="请选择区域";
    }
    if (priceType.id==0 ){
      tip = priceType.name;
    }
    if (SubjectType.id == 0) {
      tip = SubjectType.name;
    }
    if (gradeType.id == 0) {
      tip = gradeType.name;
    }
    if (demandType.id == 0) {
      tip = demandType.name;
    }
    if( tip ){
      wx.showToast({
        title: tip,
        icon:'none'
      })
      return false;
    }
    var param = {
      address: value.address,
      note: value.note,
      wechat: value.wechat,
      phone: value.phone,
      show_contact: value.show_contact,
      type: demandType.id,
      grade: gradeType.id,
      subject: SubjectType.id,
      salary: priceType.id,
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
          message = '未发布成功，请重试';
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
    var placeholder = '输入其他补充说明';
    if (e.detail.value==1 ){
      placeholder= '输入其他补充说明，如：课程特色、辅导经验、辅导时间安排等'
    }
    if (e.detail.value== 2) {
      placeholder = '输入其他补充说明，如：老师性别、教龄、经验、辅导时间安排等'
    }
    this.setData({
      placeholder:placeholder,
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
  switchChange:function(e){
    console.log(e)
    var that = this;
    if( !e.detail.value ){
      wx.showModal({
        title: '提示',
        content: '关闭后，您的联系方式将直接对外显示，建议保持开启状态。',
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {
            console.log(123)
            that.setData({
              switchStatus: true
            })
          }
        }
      })
      
    }
  },
  bindPickerChange: function (e) {
    var selects = e.detail.value;
    var data = this.data.data;
    var province = data.district[selects[0]];
    var provinceId = province.id;
    var city = province.children||[];
    var area = city[selects[1]]?city[selects[1]].children:[];
    this.setData({
      areaSelect:selects,
      citys: getArray(city),
      areas: getArray(area),
    })
  },
})
