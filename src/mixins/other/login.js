import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        messageshow: true,
        phonebtnshow: true,//按钮
        userInfo: null,
        vipInfo: null,
        // 暂存固定值
        // eid: 'LS000000',
        // eid: 'E20180824414912101',
        eid: 'e20160913452612100',
        openid: '',
        unionid: '',
        sessionKey: '',
        phone: ''
    }
    onShow() {
        // console.log(this);
        var _this = this
        if (this.vipInfo) {
            console.log('强制前往个人中心')
            wepy.Toast('已登录', 'success')
            setTimeout(() => {
                _this.toMember()
            }, 100)
        }
    }
    onLoad() {
        
        wepy.showLoading({
            title: '加载中'
        })
        // 判断并获取用户信息
        this.getSetting()
        
    }
    // 下拉刷新
    onPullDownRefresh() {

    }
    
    // 登录逻辑
    login() {
        // 如果已经登录过，就直接登录
        if(wx.getStorageSync('LoginSessionKey')){
            console.log('已登陆过');
            const res=wx.getStorageSync('LoginSessionKey')
            console.log(res);
            
            //   存入参数
            this.openid = res.openid
            this.unionid = res.unionid
            this.sessionKey = res.session_key
            // 存全局参数
            this.$parent.globalData.openid = this.openid
            this.$parent.globalData.unionid = this.unionid
            this.$parent.globalData.sessionKey = this.sessionKey
            this.$parent.globalData.eid = this.eid
            this.getVipInfo()
            return
        }
        var _this = this
        // 登录
        wx.login({
            success: async res => {
                var _this = this
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                let params = {
                    eid: this.eid,
                    code: res.code
                }
                //   登录后台
                const { data: resuser } = await wepy.post(
                    '/session/getsessionkey',
                    params
                )
                console.log(resuser, 2)
                if (!resuser.statu) return wepy.Toast('服务器无响应')
                wx.setStorageSync('LoginSessionKey',resuser.t)
                //   存入参数
                this.openid = resuser.t.openid
                this.unionid = resuser.t.unionid
                this.sessionKey = resuser.t.session_key
                // 存全局参数
                this.$parent.globalData.openid = this.openid
                this.$parent.globalData.unionid = this.unionid
                this.$parent.globalData.sessionKey = this.sessionKey
                this.$parent.globalData.eid = this.eid
                this.$apply()
                // this.getUserInfo()
                if (this.userInfo) {
                    // console.log('vip');
                    this.getVipInfo()
                }
            }
        })
    }
    // 判断授权状态,有就直接赋值，没有就手动点击授权并获取赋值
    getSetting() {
        let _this=this
        wx.getSetting({
            success: res => {
                // console.log(res, 777)
                if (!res.authSetting['scope.userInfo']) {
                    wepy.Toast('请授权信息', 'none')
                   
                } else if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            // console.log(res.userInfo)
                            // 有授权就存入全局和当前页面
                            _this.userInfo = res.userInfo
                            _this.$parent.globalData.userInfo=res.userInfo
                            _this.messageshow=false
                            _this.$apply()
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            // if (this.userInfoReadyCallback) {
                            //     this.userInfoReadyCallback(res)
                            // }
                            // 有授权就发起登录
                            _this.login()
                        }
                    })
                }
            }
        })
    }
  
    //   获取会员信息
    async getVipInfo() {
        let parent = {
            eid: this.eid,
            usOpenid: this.openid,
            usUnionid: this.unionid,
            usNickname: this.userInfo.nickName,
            usSex: this.userInfo.gender,
            usLanguage: this.userInfo.language,
            usCity: this.userInfo.city,
            usProvince: this.userInfo.province,
            usCountry: this.userInfo.country,
            usHeadimgurl: this.userInfo.avatarUrl,
            usSubscribeTime: Date.parse(new Date()) / 1000
        }
        console.log(parent,'会员信息');
        
        const { data: res } = await wepy.post('/session/getparam', parent)
        console.log(res, '会员信息获取结果')
        this.vipInfo = res.t
        this.$parent.globalData.vipInfo= res.t
        // 如果拿到的vipInfo里面的对象参数都为空，说明账号未注册
        this.$apply()
        if(this.vipInfo.cardnum==null){
            wepy.hideLoading()
            wepy.Toast('请授权登录','none')
            // 点击触发登录
        }else {
            // wepy.hideLoading()
            wepy.Toast('登录成功','success')
            console.log('前往活动');
            wx.switchTab({
                url: '/pages/tabs/member'})
            
        }
        // console.log(res.t, 99999);
        if (this.vipInfoReadyCallback) {
            console.log('vipuserback');
            this.vipInfoReadyCallback(res)
        }
    }
    toMember() {
        wepy.showLoading({
            title: '加载中'
        })
        setTimeout(()=>{
            wepy.hideLoading()
            wepy.navigateTo({
                url: '/pages/other/member'
            })
        },100)
        
    }
    methods = {
        toTerms() {
            // wepy.Toast('阅读条款待开发')
          },
          // 点击获取用户信息
          getUserInfo(e) {
            // console.log(e.detail.userInfo)
            this.$parent.globalData.userInfo = e.detail.userInfo
            this.userInfo = e.detail.userInfo
            this.messageshow = false
            this.$apply()
            this.login()
          },
          // 点击获取手机号，并登录/注册
        async getPhoneNumber(e) {
            var _this = this;
            let params = {
                eid: this.$parent.globalData.eid,
                wxid: this.$parent.globalData.openid,
                unionid: this.$parent.globalData.unionid,
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData,
                sessionKey: this.$parent.globalData.sessionKey
            }
            // 校验用户的手机号
            console.log(params,'校验手机号');
            
            const { data: res } = await wepy.post('/register/checkphone', params)
            console.log(res,'校验结果');
            
            if (!res.statu) return wepy.baseToast('获取手机号失败')
            // 如果获取到用户信息，就存起来
            this.vipInfo = res.t
            this.$parent.globalData.vipInfo = res.t
            this.phone=res.t.phone
            this.$apply()
            if (res.t.rescode === 0) {

                // console.log('已注册');
                // // 隐藏按钮
                // this.checkView = true
                wepy.hideLoading()
                wepy.Toast('登录成功','success')

                wx.navigateTo({
                    url: '/pages/other/member'})
            } else {
                console.log('未注册');
                // 执行注册
                wepy.showLoading({
                    title: '正在注册',
                    mask: true
                })
                // console.log(this.$parent.globalData);
                
                let form = {
                    phone: this.phone,
                    bzmemo: '小程序注册',
                    eid: this.$parent.globalData.eid,
                    vipname: this.$parent.globalData.userInfo.nickName,
                    sex: this.$parent.globalData.userInfo.gender,
                    unionid: this.$parent.globalData.unionid ? this.$parent.globalData.unionid : this.$parent.globalData.openid
                }
                console.log(form);
                
                const { data: res } = await wepy.post('/register/registervip', form)
                // console.log(res);
                if (res.statu) {
                    // console.log(res);
                    
                    this.$parent.globalData.vipInfo = res.t
                    this.vipInfo = res.t
                    this.$apply()
                    wx.hideLoading()
                    wepy.Toast(res.mes,'success')
                    // console.log(this.$parent.globalData);
                    // console.log('前往个人中心');
                    this.$parent.globalData.showgift=true
                    wx.navigateTo({
                        url: '/pages/other/member'})
                } else {
                    wepy.Toast(res.mes,'none')
                }

            }
        },
    }
    // 计算函数
    computed = {

    }
}