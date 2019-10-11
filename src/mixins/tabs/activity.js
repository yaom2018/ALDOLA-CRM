import wepy from 'wepy'
var QQMapWX = require('../tool/qqmap-wx-jssdk.js')
var qqmapsdk
export default class Home extends wepy.mixin {
    data = {
        // 我的定位
        address: '',
        // 经纬
        latitude: '',
        longitude: ''
    }
    onShow() {
        this.getSetting()
    }
    onLoad() {
        qqmapsdk = new QQMapWX({
            key: '2CDBZ-GYICP-J65D4-LCXU2-IU3NJ-2QBXW' //这里使用的是自己的秘钥
        })
        this.getActivities()
    }
    // 鉴权
    getSetting() {
        wx.getSetting({
            success: (res) => {
                console.log(JSON.stringify(res), 888)
                // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
                // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
                // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function (dataAu) {
                                        if (dataAu.authSetting["scope.userLocation"] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            //再次授权，调用wx.getLocation的API
                                            this.getLocation()
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) {
                    //调用wx.getLocation的API
                    console.log('没有权限');
                    // wx.authorize({
                    //     scope: 'scope.userLocation',
                    //     success(){
                    //         console.log(222222);

                    //     }
                    // })
                    this.getLocation()
                }
                else {
                    //   有权限
                    console.log('有权限');
                    //调用wx.getLocation的API
                    this.getLocation()
                }
            }
        })
    }
    // 获取经纬度
    getLocation() {
        let vm = this
        wx.getLocation({
            type: 'wgs84',
            success: res => {
                console.log(res);
                let latitude = res.latitude
                let longitude = res.longitude
                let speed = res.speed
                let accuracy = res.accuracy
                vm.getLocal(latitude, longitude)
            },
            fail: res => {
                console.log('fail' + JSON.stringify(res));

            }
        })
    }
    // 获取当前地理位置
    getLocal(latitude, longitude) {
        let vm = this;
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: latitude,
                longitude: longitude
            },
            success: res => {
                console.log(res.result.address,99);
                vm.address = res.result.address
                this.latitude=latitude
                this.longitude=longitude
                this.$apply()

            },
            fail: function (res) {
                console.log(res);
            },
            complete: function (res) {
                // console.log(res);
            }
        })
    }
    // 获取正在进行的活动
    async getActivities(){
        const { data: res } = await wepy.posttest('http://t.ligesoft.com/wx/wxi/base/event/getevents', 'LS000000')
        console.log(res);
        
    }
    methods = {
        tosearch(){
            wx.navigateTo({
                url: '/pages/other/search'
            })
        },
        // 点击重新获取地址
        tapgetLocation() {
            console.log(this,11111)
            let vm=this
            wx.getSetting({
                success: res => {
                    console.log(res, 777)
                    wx.openSetting({
                        success(res) {
                            console.log('授权成功')
                            if (res.authSetting['scope.userLocation']) {
                                vm.getLocation()
                            }
                        }
                    })
                }
            })
        },

    }
    // 计算函数
    computed = {

    }
}

