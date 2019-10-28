import wepy from 'wepy'
export default class Home extends wepy.mixin {
  data = {
    login: false,
    showcheckuser: false,
    showcheckphone: false,
    userInfo: null,
    vipInfo: null,
    allCoupons: [], //所有可领取的优惠券
    uncouponnum: 0, //所有已领取未使用的优惠券
    showgift: false, //礼包弹框
    ConfirmButton: false, //弹框确定按钮
    getCouponarr: [],
    // 当前等级所需积分
    gradepoint: 2000,
    // 注册渠道编号
    registnum: ''
  }
  onShow() {
    // console.log('member-onshow');
    // this.showgift = this.$parent.globalData.showgift
    // this.$apply()
    // 页面切换刷新数据

    // this.getmycoupon()
    // this.getMessage()


  }
  onHide() {
    console.log('离开');
    this.showgift=false
  }
  async onLoad(options) {
    console.log(options,'进入传参')
    // 接收注册渠道
    this.registnum=options.registnum
    this.$apply()
    //   判断是否过期/首次登录
    const reslogin = await this.$parent.checkLogin()
    console.log(reslogin, '登录状态')
    //   如果没有登陆，请点击获取用户信息
    if (!reslogin.loginstatu) {
      this.showcheckuser = true
      this.$apply()
      return
	}
	
    const resuserinfo = await this.$parent.getuserInfo()
	console.log(resuserinfo)
	if(!resuserinfo.userinfostatu){
		this.showcheckuser = true
		this.$apply()
		wepy.Toast(resuserinfo.mes,'none')
		return
	}
	// 获取到用户信息赋值
	this.userInfo=resuserinfo.userInfomessage
	this.$parent.globalData.userInfo=resuserinfo.userInfomessage
	this.$apply()
	// 获取本地缓存用户登录状态
	let loginflag=wx.getStorageSync('loginFlag')
	// 获取vipinfo
	// console.log(loginflag);
	const vipinfores=await this.$parent.getVipInfo(loginflag)
	console.log(vipinfores,'校验手机号状态')
	if(!vipinfores.statu){
		return wepy.Toast(vipinfores.mes)
	}
	this.vipInfo=vipinfores.vipInfo
	this.$parent.globalData.vipInfo=vipinfores.vipInfo
	this.login=true
	this.$apply()
	// 获取卡券
	const couponres=await this.$parent.getcounon(0)
	console.log(couponres,'获取优惠券')
	if(!couponres.statu) return wepy.Toast(couponres.mes)
	this.uncouponnum=this.$parent.globalData.uncouponnum
	this.$apply()
  }
  // 下拉刷新
  onPullDownRefresh() {

  }

  methods = {
    // 点击获取用户信息
    async getUserInfo(e) {

      console.log(e, '点击授权用户信息')
      // 取消授权
      if (e.detail.errMsg != "getUserInfo:ok") {
        wepy.Toast('取消了授权用户信息', 'none')
        return
      }
      // 发起登录
      const dologinres = await this.$parent.doLogin()
      console.log(dologinres, '点击授权登录')
      if (!dologinres.statu) return wepy.Toast(dologinres.mes, 'none')
      // // 同意授权用户信息-----手动校验手机号获取vip信息
      this.$parent.globalData.userInfo = e.detail.userInfo
      this.userInfo = e.detail.userInfo
      this.showcheckuser = false
      this.showcheckphone = true
      this.$apply()
    },
    // 点击获取手机号，并登录/注册
    async getPhoneNumber(e) {
      console.log(e)
      if (e.detail.errMsg !== "getPhoneNumber:ok") return wepy.Toast('取消了手机授权', 'none')

      // const resvipinfo2=await this.$parent.getVipInfo2(this.$parent.globalData.userInfo)
      // console.log(resvipinfo2,'resvipinfo2')
      // if(!resvipinfo2.statu) return
      var _this = this
      let params = {
        eid: this.$parent.globalData.eid,
        wxid: this.$parent.globalData.openid,
        unionid: this.$parent.globalData.unionid,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        sessionKey: this.$parent.globalData.sessionKey
      }
      // 校验用户的手机号
      console.log(params, '校验手机号')


      const {
        data: res
      } = await wepy.post('/register/checkphone', params)
      console.log(res, '校验结果')

      if (!res.statu) return wepy.baseToast('手机登录失败', 'loading')

      // 存入本地缓存---------------------------
      let loginFlag = {
        wxid: this.$parent.globalData.openid,
        unionid: this.$parent.globalData.unionid,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        sessionKey: this.$parent.globalData.sessionKey
      }


      // 如果获取到用户信息，就存起来
      this.vipInfo = res.t
      this.$parent.globalData.vipInfo = res.t
      console.log(this.$parent.globalData.vipInfo, '校验后存全局vipinfo');

      this.phone = res.t.phone

      this.$apply()
      if (res.t.rescode === 0) {
        console.log('已注册');
        wepy.hLoad()
        wepy.baseToast('登录成功')
		wx.setStorageSync('loginFlag', loginFlag)
		this.login=true
		this.showcheckuser=false
    	this.showcheckphone=false
        this.$apply()
		// 获取卡券
		const couponres=await this.$parent.getcounon(0)
		console.log(couponres,'获取优惠券')
		if(!couponres.statu) return wepy.Toast(couponres.mes)
		this.uncouponnum=this.$parent.globalData.uncouponnum
		this.$apply()
    	} else {
        console.log('未注册')
    //     // 执行注册
        wx.showLoading({
          title: '正在注册',
          mask: true
        })

        let form = {
          phone: this.phone,
            // phone: 18788888822,
          bzmemo: '小程序注册',
          eid: this.$parent.globalData.eid,
          vipname: this.$parent.globalData.userInfo.nickName,
          sex: this.$parent.globalData.userInfo.gender,
          registnum: this.registnum,
          unionid: this.$parent.globalData.unionid ? this.$parent.globalData.unionid : this.$parent.globalData.openid
        }
        console.log(form)

        const {
          data: res
        } = await wepy.post('/register/registervip', form)
        console.log(res, 999999)
        if (res.statu) {
          console.log(res, '注册成功');
          wx.setStorageSync('loginFlag', loginFlag)
          this.$parent.globalData.vipInfo = res.t
          this.vipInfo = res.t
          wx.hideLoading()
          wepy.Toast(res.mes, 'success')
		      this.login=true
		      this.showcheckuser=false
		      this.showcheckphone=false
          this.showgift = true
          // 获取卡券
		const couponres=await this.$parent.getcounon(0)
		console.log(couponres,'获取优惠券')
		if(!couponres.statu) return wepy.Toast(couponres.mes)
		this.uncouponnum=this.$parent.globalData.uncouponnum
          this.$apply()
			// 获取卡券
        } else {
          wepy.Toast('注册失败')
        }

      }
    },
    toCoupon() {
		if(!this.login){
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
    to_new() {
      wx.navigateToMiniProgram({
        appId: 'wx627972fa7b9597ee',
        // path: 'page/index/index?id=123',
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
    // 查看会员权益
    to_memberDes() {
      console.log('查看会员权益')
    },
    // 关闭弹框
    closegift() {
      this.showgift = false
    },
    // 前往会员详情
    toMydetail() {
		if(!this.login){
			wepy.Toast('请授权登录')
			return
		}
      wx.navigateTo({
        url: '/pages/other/mydetail'
      })
    },
    // 前往积分明细
    toIntegral(){
      if(!this.login){
        wepy.Toast('请授权登录')
        return
      }
        wx.navigateTo({
          url: '/pages/other/integral'
        })
    },
    // 完善信息
    to_toInformation() {
		if(!this.login){
			wepy.Toast('请授权登录')
			return
		}
      wepy.navigateTo({
        url: '/pages/other/information'
      })
    },
    // 前往优惠券
    toCounon() {
		if(!this.login){
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
