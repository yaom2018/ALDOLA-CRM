import wepy from 'wepy'
// appid: wx1be3749c31578f2e  雅黛丽
// appid: wx9070d9cdad1eef4c  力格微小店
// 加载可扩展版 icon:success/loading/none
wepy.Toast = (str = '加载中',state='loading') => {
    wepy.showToast({
        title: str,
        icon: state,
        mask:true,
        duration: 1500
    })
}
// 加载完毕
wepy.baseToast = (str = '加载成功',state='success') => {
    wepy.showToast({
        title: str,
        icon: state,
        duration: 1500
    })
}
// 后台请求状态加载
wepy.Load = (title = '加载中',mask=true,cb=()=>{}) => {
    wx.showLoading({
        title: title,
        mask: mask,
        success: cb
      })
}
wepy.hLoad = () => {
    wx.hideLoading()
}
// 请求根路径
// get
const baseURL = 'https://m.ligesoft.com/wx/wxsa'
// const baseURL = 'http://t.ligesoft.com/wx/wxsa'
// const baseURL = 'http://192.168.10.129:9091/wx/wxsa'
wepy.get = (url, data = {}) => {
    return wepy.request({
        url: baseURL + url,
        method: 'GET',
        data
    })
}
// post
wepy.post = (url, data = {}) => {
    return wepy.request({
        url: baseURL + url,
        method: 'POST',
        data,
        header: {
            'content-type': 'application/json', // 默认值
            'auth': "ligesofts"
          }
    })
}
// test
wepy.gettest = (url, data = {}) => {
    return wepy.request({
        url: url,
        method: 'GET',
        data
    })
}
wepy.posttest = (url, data = {}) => {
    return wepy.request({
        url: url,
        method: 'POST',
        data,
        header: {
            'content-type': 'application/json', // 默认值
            'auth': "ligesofts"
          }
    })
}