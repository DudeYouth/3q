
function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}
function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}
function getArray(data) {
  var arr = [];
  data && data.length && data.forEach(function (v) {
    arr.push({
      'id': v.id,
      'name': v.name,
    })
  });
  return arr;
}
function request(param){
  wx.request({
    url: 'https://api.3q91.com/v1/'+param.url,
    header:param.header||{},
    data: param.data,
    method: param.type||'get',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      param.success&&param.success(res);
    },
    fail: function (res) { 
      param.fail && param.fail(res);
    },
    complete: function (res) {
      param.complete && param.complete(res);
     },
  })
}
function objectToArray(obj){
  var arr = [];
  for( var key in obj ){
    arr.push(obj[key])
  }
  return arr;
}
function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  request:request,
  objectToArray: objectToArray,
  getArray: getArray,
  isEmptyObject: isEmptyObject,
}
