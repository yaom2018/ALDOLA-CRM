import wepy from 'wepy'
import base64 from '@/mixins/tool/base64.js'
var QQMapWX = require('../tool/qqmap-wx-jssdk.js')
var qqmapsdk
export default class Home extends wepy.mixin {
  data = {
    // 版本号
    versionNum: '1.2.3',
    login: false,
    showcheckuser: true,
    showcheckphone: true,
    userparams: null,
    userInfo: null,
    vipInfo: null,
    // 表单信息
    vipmessage: null,
    allCoupons: [], //所有可领取的优惠券
    showgift: false, //礼包弹框
    ConfirmButton: false, //弹框确定按钮
    getCouponarr: [],
    // 当前等级所需积分
    gradepoint: 0,
    // 注册渠道编号
    registnum: '',
    // marginHeight: 0,
    // tab栏样式切换
    tab_style: {
      left: '',
      right: ''
    },
    // 活动数据
    activity: [{
      src: 'http://img.pengwang.xyz/image/aldolabanner1.png'
    }, {
      src: 'http://img.pengwang.xyz/image/aldolabanner2.png'
    }],
    tab_active_color: 'border-bottom: 4rpx solid #4b4849',
    tab_color: 'border-bottom: 4rpx solid #f4f4f4',
    // 我的定位
    address: '',
    // 经纬
    latitude: '',
    longitude: ''
  }
  onReady() {
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
  }
  async onShow() {
    this.getSetting()
    if (!this.$parent.globalData.vipInfo) {
      console.log('未登陆')
      return
    } else {
      console.log('已登录')
      // 获取会员信息
      
      let getparamres = await this.$parent.getVipInfo2()
      console.log(getparamres, '会员信息')
      // 赋值
      this.$parent.globalData.vipInfo = getparamres.t
      this.vipInfo = getparamres.t
      // 获取表单信息
      this.get_usermessage()

      this.$apply()
      // 成长值===================================
      this.getPonitMax()
      this.$apply()
    }

  }


  onHide() {
    console.log('离开')
    this.showgift = false
    this.$apply()
  }
  async onLoad(options) {
    // 登录wx
    let loginRes = await wepy.login().catch(err => err)
    console.log(loginRes, 'wxlogin')
    this.$parent.globalData.code = loginRes.code
    console.log(this.$parent.globalData.code, 'code')
    // 缓存中获取数据
    var datames = wx.getStorageSync('datames')
    // 积分余额变更后查询更新
    this.$parent.globalData.datames=datames
    // 定位
    qqmapsdk = new QQMapWX({
      key: '2CDBZ-GYICP-J65D4-LCXU2-IU3NJ-2QBXW' //这里使用的是自己的秘钥
    })
    // this.getActivities()

    const res = await this.$parent.getSettingStatus('scope.userInfo')
    console.log(res, 1111)
    if (res.statu === true) {
      // 已授权
      this.showcheckuser = false
      this.$apply()
    }

    // tab样式
    this.tab_style = {
        left: this.tab_active_color,
        right: this.tab_color
      },
      // 登录
      this.getLoginstatu()

    // 动态设置下拉字体
    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
    wx.setBackgroundColor({
      backgroundColor: '#40444d', // 窗口的背景色为
      backgroundColorBottom: '#f4f4f4', // 底部窗口的背景色为白色
    })

  }
  // 下拉刷新
  onPullDownRefresh() {

  }
  // 发起登录拿到登录状态
  async getLoginstatu() {
    const statures = await this.$parent.checkLogin()
    console.log(statures, '登录状态')
    // statures.loginstatu=1/0,没有登录过或者过期
    if (statures.loginstatu !== true) {

      // 判断是否已授权用户信息
      const statures = await this.$parent.getSettingStatus('scope.userInfo')
      console.log(statures, '授权状态')
      // 没有授权过，需要点击授权
      if (statures.statu === 1) {
        console.log('点击授权用户信息');
        wepy.Toast('点击授权用户信息', 'none')
        return
      }
      // 拒绝授权过，需要点击授权
      if (statures.statu === 2) {
        console.log('点击授权用户信息')
        wepy.Toast('点击授权用户信息', 'none')
        return
      }
      // 授权过
      const userinfoRes = await wepy.getUserInfo().catch(err => err)
      console.log(userinfoRes, '获取用户信息');
      this.$parent.globalData.userInfo = userinfoRes.userInfo
      this.userInfo = userinfoRes.userInfo
      this.showcheckuser = false
      this.showcheckphone = true
      this.$apply()
      return
    }
    // 授权过
    // 判断是否已授权用户信息
    const settingstatures = await this.$parent.getSettingStatus('scope.userInfo')
    console.log(settingstatures, '授权状态')
    // 没有授权过，需要点击授权
    if (settingstatures.statu === 1) {
      console.log('点击授权用户信息');
      wepy.Toast('点击授权用户信息', 'none')
      return
    }
    // 拒绝授权过，需要点击授权
    if (settingstatures.statu === 2) {
      console.log('点击授权用户信息')
      wepy.Toast('点击授权用户信息', 'none')
      return
    }
    // 授权过用户信息
    const userinfoRes = await wepy.getUserInfo().catch(err => err)
    console.log(userinfoRes, '获取用户信息');
    this.$parent.globalData.userInfo = userinfoRes.userInfo
    this.userInfo = userinfoRes.userInfo

    // 缓存中获取数据
    var datames = wx.getStorageSync('datames')
    console.log(datames, '老用户登录')
    this.$parent.globalData.datames=datames
    // 请求服务器获取vipinfo
    // 发起老用户登录
    let getparamres = await this.$parent.getVipInfo2()
    console.log(getparamres, '老用户登录结果')
    // 如果失败了
    if (!getparamres.statu) {
      console.log(222);
      // that.cbparams(that)
      // return
      wepy.Toast('服务器无响应')
      return
    }
    // 赋值
    this.$parent.globalData.vipInfo = getparamres.t
    this.vipInfo = getparamres.t
    this.$apply()
    // 成长值===================================
    this.getPonitMax()

    this.login = true
    this.showcheckuser = false
    this.showcheckphone = false
    this.$apply()
    // 获取活动优惠券和用户基本信息
    // this.loadCoupons(this)
    this.get_usermessage()
    this.$apply()
    // console.log('不是首次登录')
  }
  // 获取全局自定义表单信息
  async get_usermessage() {
    const res = await this.$parent.getvipmessage()
    console.log(res, '会员表单信息')
    if (!res.statu) {
      console.log(res.mes);
      return
    }
    this.vipmessage = res.res.vinfo
    this.$apply()
  }
  // 获取活动优惠券
  //  async loadCoupons(_this,flag) {

  //   let params = {
  //       eid: this.$parent.globalData.vipInfo.eid,
  //       vipid: this.$parent.globalData.vipInfo.vid
  //   }
  //   console.log(params);
  //   const res = await wepy.post('/coupon/getecoupons', params)
  //   console.log(res.data, 666666666);
  //   let data = res.data
  //   // console.log(data.statu, 9);
  //   if (data.statu) {
  //       this.allCoupons = data.rows
  //       this.$apply()
  //   }else {
  //     this.allCoupons = []
  //       this.$apply()
  //   }
  //   if(flag){
  //     wepy.Toast('领取成功','success')
  //   }
  // }

  // 鉴权定位
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
        } else {
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
  // 获取成长值上限
  getPonitMax(){
    // 成长值===================================
    if (this.vipInfo.qpname == '注册会员') {
      this.gradepoint = 1
    } else if (this.vipInfo.qpname == '普卡会员') {
      this.gradepoint = 600
    } else if (this.vipInfo.qpname == '准金卡会员') {
      this.gradepoint = 1000
    } else if (this.vipInfo.qpname == '金卡会员'){
      this.gradepoint = 99999
    }
    this.$apply()
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
        console.log(res.result.address, 99);
        vm.address = res.result.address
        this.latitude = latitude
        this.longitude = longitude
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
  methods = {
    // 点击获取用户信息
    async getUserInfo(e) {
      // console.log(e, '点击授权用户信息')
      // 取消授权
      if (e.detail.errMsg != "getUserInfo:ok") {
        wepy.Toast('取消了授权用户信息', 'none')
        return
      }
      // // 同意授权用户信息-----手动校验手机号获取vip信息
      this.$parent.globalData.userInfo = e.detail.userInfo
      this.userInfo = e.detail.userInfo
      // this.userparams = e.detail
      this.showcheckuser = false
      // this.showcheckphone = true
      this.$apply()
    },
    // 点击获取手机号，并登录/注册
    async getPhoneNumber(e) {
      let that = this
      console.log(e)
      if (e.detail.errMsg !== "getPhoneNumber:ok") return wepy.Toast('取消了手机授权', 'none')
      // this.userparams=e.detail
      // 发起注册登录
      let getparamres = await this.$parent.getparam(e.detail, this.userInfo)
      console.log(getparamres, 'getparam')
      // 如果失败了
      if (!getparamres.statu) {
        console.log(222);
        // that.cbparams(that)
        // return
        wepy.Toast('服务器无响应')
        return
      }
      // 赋值
      this.$parent.globalData.vipInfo = getparamres.t
      this.vipInfo = getparamres.t
      // this.$apply()
      if (getparamres.t.rescode === 0) {
        console.log('已注册')
        this.getPonitMax()
        this.login = true
        this.showcheckuser = false
        this.showcheckphone = false
        this.$apply()
        wepy.baseToast('登录成功')

      }
      if (getparamres.t.rescode === null) {
        console.log('未注册')
        wepy.baseToast('注册成功')
        // 弹礼包框------------------
        this.getPonitMax()
        this.showgift = true
        this.login = true
        this.showcheckuser = false
        this.showcheckphone = false
        this.$apply()
      }
      let datames = {
        openid: getparamres.t.wxid,
        unionid: getparamres.t.unionid,
        // userInfo: this.userInfo
      }
      // 存入本地缓存---------------------------
      wx.setStorageSync('datames', datames)
      // 获取卡券
      this.$parent.globalData.openid = getparamres.t.wxid
      this.$parent.globalData.unionid = getparamres.t.unionid

      // 获取活动优惠券
      // this.loadCoupons(this, false)
      this.get_usermessage()
      this.$apply()
    },
    // tab栏切换
    switch_acticity(id) {
      console.log(id)
      if (id == 0) {
        this.tab_style = {
          left: this.tab_active_color,
          right: this.tab_color
        }

      }
      if (id == 1) {
        this.tab_style = {
          left: this.tab_color,
          right: this.tab_active_color
        }

      }
    },
    // 点击重新获取地址
    tapgetLocation() {
      wepy.Toast('重新获取地址中')
      let vm = this
      wx.getSetting({
        success: res => {
          console.log(res, 777)
          if (res.authSetting['scope.userLocation']) {
            vm.getLocation()
            return
          }
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
    // 服务权益------start---------------------------
    // vip绑定
    to_vipBd() {
      wx.navigateTo({
        url: '/packageA/pages/view/vip_bind'
      })

    },
    // 查看会员权益
    to_memberDes() {
      wx.navigateTo({
        url: '/packageA/pages/view/vip_equity'
      })
    },
    // 明佑优品
    to_new() {
      wx.navigateToMiniProgram({
        appId: 'wxea706202be89c22b',
        path: 'pages/common/blank-page/index?weappSharePath=pages%2Fhome%2Fdashboard%2Findex%3Fkdt_id%3D41580462',
        // extraData: {
        //   foo: 'bar'
        // },
        // envVersion: 'develop',
        success(res) {
          // 打开成功
          console.log('success');

        },
        fail(res) {
          console.log('fail');
        }
      })
    },
    // 完善信息
    to_toInformation() {
      if (!this.login) {
        wepy.Toast('请授权登录')
        return
      }
      wepy.navigateTo({
        url: '/pages/other/information'
      })
    },
    // 申诉
    to_appeal() {
      wx.navigateTo({
        url: '/packageA/pages/view/vip_appeal'
      })
    },
    // 积分升级
    to_jifenlevel(){
      wx.navigateTo({
        url: '/packageA/pages/view/jifen_level'
      })
    },
    // 服务权益------end---------------------------
    // 卡券
    toCoupon() {
      if (!this.login) {
        wepy.Toast('请授权登录')
        return
      }
      wx.navigateTo({
        url: '/pages/other/mycounon'
      })
      // wx.switchTab({
      // url: '/pages/tabs/coupon'
      // })
    },

    // 前往领券中心
    to_compon() {
      wx.switchTab({
        url: '/pages/tabs/coupon'
      })
    },

    // 关闭弹框
    closegift() {
      this.showgift = false
    },
    // 前往会员详情
    toMydetail() {
      if (!this.login) {
        wepy.Toast('请授权登录')
        return
      }
      wx.navigateTo({
        url: '/pages/other/mydetail'
      })
    },
    // 前往积分明细
    toIntegral() {
      if (!this.login) {
        wepy.Toast('请授权登录')
        return
      }
      wx.navigateTo({
        url: '/pages/other/integral'
      })
    },
    // 营销活动栏--前往明佑优品小程序
    to_myyp(e) {
      let id = e.currentTarget.dataset.id
      if (id == 1) {
        wx.navigateToMiniProgram({
          appId: 'wxea706202be89c22b',
          path: 'pages/common/blank-page/index?weappSharePath=pages%2Fhome%2Fdashboard%2Findex%3Fkdt_id%3D41580462',
          // extraData: {
          //   foo: 'bar'
          // },
          // envVersion: 'develop',
          success(res) {
            // 打开成功
            console.log('success');

          },
          fail(res) {
            console.log('fail');
          }
        })
      }

    },
    
    // 领取优惠券
    // async getEcoupon(e) {
    //   var _this = this;
    //   wepy.Toast('正在领取')
    //   let params = {
    //     mid: e.currentTarget.id,
    //     eid: this.$parent.globalData.vipInfo.eid,
    //     vipid: this.$parent.globalData.vipInfo.vid
    //   }
    //   const {
    //     data: res
    //   } = await wepy.post('/coupon/getcoupon', params)

    //   console.log(res, '领取优惠券')
    //   if (!res.statu) return wepy.Toast(res.mes)
    //   this.loadCoupons(_this, true)
    // },

    // 前往优惠券
    toCounon() {
      if (!this.login) {
        wepy.Toast('请授权登录')
        return
      }
      wx.navigateTo({
        url: '/pages/other/mycounon'
      })
    },

  }
  // 计算函数
  computed = {

  }
}
