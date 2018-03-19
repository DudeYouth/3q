var demandType = ['all', 'd1', 'd2']
var SubjectType = ['all', 'replied', 'unreply']
var gradeType = ['all', 'g1', 'g2', 'g3']
import { request, getArray, objectToArray } from '../../util/util.js';
var app = getApp();

Page({
  data: {
    provinces: [],
    citys: [],
    province: 0,
    city: 0,
    index: 0,
    lists: [],
    areaSelect: [0, 0, 0],
    areaSelectId: [0, 0, 0],
    demandTypeIndex: 0,
    demandType: [],
    animationData: '',
    SubjectTypeIndex: 0,
    SubjectType: [],
    winH: 480,
    gradeTypeIndex: 0,
    gradeType: [],
    district: [],
    areaShow: false,
    areaHeight: 0,
    grant: false,
    page: 1,
    perPage: 10,
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onReachBottom: (function (e) {
    var timer = null;
    return function () {
      var that = this;
      if (!timer) {
        wx.showToast({
          title:'加载中',
          icon: 'loading',
          duration:1500
        })
        timer = setTimeout(function () {
          clearTimeout(timer);
          timer = 0;
          that.demands();
        }, 600);

      }
    }

  })(),

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
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e, 123)
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      request({
        url: 'security/verify',
        type: 'post',
        data: {
          data: e.detail.encryptedData,
          iv: e.detail.iv,
        },
        header: {
          Token: app.globalData.access_token,
        },
        success: function (res) {
          console.log(res)
          if( res.data.code==0 )
            wx.navigateTo({ url: '/page/publish/publish?phone=' + res.data.data.phoneNumber })
        },
      })
    }
  },
  demands: function (flag) {
    var that = this;
    var selects = this.data.areaSelect;
    var province = this.data.district[selects[0]];
    var provinceId = province.id;
    var city = province.children || [];
    var cityId = city[selects[1]] && city[selects[1]].id;
    var param = {};
    var type = this.data.demandType[this.data.demandTypeIndex].id;
    var subject = this.data.SubjectType[this.data.SubjectTypeIndex].id;
    var grade = this.data.gradeType[this.data.gradeTypeIndex].id;
    if (type) {
      param['type'] = type;
    }
    if (subject) {
      param['subject'] = subject;
    }
    if (grade) {
      param['grade'] = grade;
    }
    if (provinceId) {
      param['province'] = provinceId;
      param['city'] = cityId;
    };
    param['page'] = this.data.page;
    param['per-page'] = this.data.perPage;
    this.setData({
      page: this.data.page + 1,
    })
    request({
      url: 'demands',
      data: param,
      success: function (res) {
        if (res.data.code == 0) {
          if (!flag) {
            res.data.data.items.forEach(function (value) {
              that.data.lists.push(value);
            });
            that.setData({
              lists: that.data.lists
            })
          } else {
            that.setData({
              lists: res.data.data.items
            })
          }

        }
      }
    });
  },
  confirm: function () {
    this.demands(true);
    this.closeModal();
  },
  scrollTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  bindPickerChange: function (e) {
    var selects = e.detail.value;
    var province = this.data.district[selects[0]];
    var provinceName = province.name;
    var city = province.children || [];
    var cityName = city[selects[1]] ? city[selects[1]].name : '';
    this.setData({
      province: provinceName,
      city: cityName.substring(0, 3),
      areaSelect: selects,
      citys: getArray(city),
    })
  },
  demandTypeChange: function (e) {
    this.setData({
      demandTypeIndex: e.detail.value
    });
    this.demands(true);
  },
  SubjectTypeChange: function (e) {
    this.setData({
      SubjectTypeIndex: e.detail.value
    });
    this.demands(true);
  },

  onLoad: function (e) {

    var _this = this;
    var data = wx.getStorageSync('all_data');
    var last = { 'id': 0, 'name': '不限' };
    data.district.unshift({ 'id': 0, 'name': '区域' });
    var district = data.district;
    var city = district[_this.data.areaSelect[0]].children;
    data.type.unshift({ 'id': 0, 'name': '需求' });
    data.type.push(last);
    data.subject.unshift({ 'id': 0, 'name': '科目' });
    data.subject.push(last);
    data.grade.unshift({ 'id': 0, 'name': '年级' });
    data.grade.push(last);
    _this.setData({
      district: district,
      provinces: getArray(district),
      citys: getArray(city),
      demandType: data.type,
      SubjectType: data.subject,
      gradeType: data.grade
    });
    request({
      url: 'users/' + app.globalData.user_id + '/phone',
      header: {
        Token: app.globalData.access_token,
      },
      success: function (res) {
        console.log(res)
        if (!res.data.data.phone) {
          _this.setData({
            grant: true
          });
        }
      }
    });
    wx.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        this.setData({
          winH: res.windowHeight
        });
      }
    });
    this.demands();
  },
  gradeTypeChange: function (e) {
    this.setData({
      gradeTypeIndex: e.detail.value
    });
    this.demands(true);
  },
  navigateTo: function () {
    wx.navigateTo({ url: '/page/publish/publish' })
  }
})

