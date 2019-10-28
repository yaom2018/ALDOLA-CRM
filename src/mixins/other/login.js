import wepy from 'wepy'
export default class Home extends wepy.mixin {
  data = {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    messageshow: false,
    phonebtnshow: false, //按钮
    userInfo: null,
    vipInfo: null,
    // 暂存固定值
    eid: '',
    openid: '',
    unionid: '',
    sessionKey: '',
	phone: '',
	barHeight: 0
  }
  onShow() {
    // console.log(this);
    // var _this = this
    // if (this.vipInfo) {
    //     console.log('强制前往个人中心')
    //     wepy.Toast('已登录', 'success')
    //     setTimeout(() => {
    //         _this.toMember()
    //     }, 100)
    // }
  }
  onLoad(options) {
    // 按需显示授权按钮
    // console.log(options);
    // if (options.messageshow) {
    //   this.messageshow = options.messageshow
    // }
    // if (options.phonebtnshow) {
    //   console.log('phonebtnshow');
    //   this.phonebtnshow = options.phonebtnshow
	  // }
	// 获取状态栏高度
	wx.getSystemInfo({
		success: (res)=> {
		  console.log(res.statusBarHeight)
		  this.barHeight=res.statusBarHeight
		  this.$apply()
		}
	  })
    // wepy.showLoading({
    //     title: '加载中'
    // })
    // // 判断并获取用户信息
    // this.getSetting()

  }
  // 下拉刷新
  onPullDownRefresh() {

  }

  toMember() {
    wepy.showLoading({
      title: '加载中'
    })
    setTimeout(() => {
      wepy.hideLoading()
      wepy.navigateTo({
        url: '/pages/other/member'
      })
    }, 100)

  }


  methods = {
    toTerms() {
      // wepy.Toast('阅读条款待开发')
    },
    // 点击获取用户信息
    async getUserInfo(e) {
      console.log(e.detail.userInfo, '点击授权用户信息')
      // 取消授权
      if (e.detail.errMsg != "getUserInfo:ok") {
        wepy.Toast('取消了授权用户信息', 'none')
        return
      }
      // 同意授权用户信息-----手动校验手机号获取vip信息
	  this.$parent.globalData.userInfo=e.detail.userInfo
      this.messageshow = false
      this.phonebtnshow = true
      this.$apply()
      console.log(this.$parent.globalData, '全局信息')
    },
    // 点击获取手机号，并登录/注册
    async getPhoneNumber(e) {
		console.log(e)
		if(e.detail.errMsg!=="getPhoneNumber:ok") return wepy.Toast('取消了手机授权', 'none')
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
	  console.log(this.$parent.globalData.vipInfo,'校验后存全局vipinfo');
	  
      this.phone = res.t.phone

      this.$apply()
      if (res.t.rescode === 0) {
        console.log('已注册');
        wepy.hLoad()
        wepy.Toast('登录成功')
        wx.setStorageSync('loginFlag', loginFlag)
        
		this.$apply()
          wx.switchTab({
            url: '/pages/tabs/member'
          })
      } else {
        console.log('未注册')
        // 执行注册
        wx.showLoading({
          title: '正在注册',
          mask: true
        })
        // console.log(this.$parent.globalData);

        let form = {
          phone: this.phone,
        //   phone: 18788888816,
          bzmemo: '小程序注册',
          eid: this.$parent.globalData.eid,
          vipname: this.$parent.globalData.userInfo.nickName,
          sex: this.$parent.globalData.userInfo.gender,
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
          console.log('前往个人中心')
          this.$parent.globalData.showgift = true
          this.$apply()
          wx.switchTab({
            url: '/pages/tabs/member'
          })
        } else {
          wepy.Toast('注册失败')
        }

      }
    },
  }
  // 计算函数
  computed = {

  }
}
