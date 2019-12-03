import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        // input值
        card_input: '',
        // 未绑定过
        no_bind: true,
        // 绑定成功
        success_bind: false,
        // 已绑定过
        old_bind: false,
        // 绑定失败
        shibai_bind: false,
        height: '',
        card_num: ''
    }
    // 页面切换显示
    onShow() {
    }
    onHide(){
        this.no_bind=true
        this.old_bind=false
        this.shibai_bind=false
        this.success_bind=false
        this.$apply()
    }
    // 页面加载
    onReady(){
        const res = wx.getSystemInfoSync()
        console.log(res);
        this.height='height:'+res.windowHeight+'px'
        this.$apply()
    }
    onLoad() {
        this.get_checkBind()
    }
    async get_checkBind(){
        let params = {
            eid: 'LS000000',
            // eid: this.$parent.globalData.eid,
            vid: '190000000001056'
            // vid: this.$parent.globalData.vipInfo.vid
        }
        const {data:res} = await wepy.post2('/wx/wxi/vip/getbinding', params)
        console.log(res,'检测是否绑定')
        if(!res.mes) return wepy.Toast('查询失败')
        // 未绑定
        if(res.statu){
            wepy.Toast(res.mes,'none')
            // 显示绑定页面
            this.no_bind=true
            this.old_bind=false
            this.shibai_bind=false
            this.success_bind=false
            this.$apply()
        }
        // 已绑定
        if(!res.statu){
            wepy.Toast(res.mes,'none')
            // 显示已绑定弹框。隐藏绑定页面
            this.no_bind=false
            this.old_bind=true
            this.shibai_bind=false
            this.success_bind=false
            this.card_num=res.bindingcard
            this.$apply()
        }

    }
    
    // 处理事件函数
    methods = {
        changeInput(e){
            this.card_input=e.detail.value
            this.$apply()
        },
        shaoma(){
            let that=this
            console.log('扫码')
            wx.scanCode({
                scanType:['barCode', 'qrCode'],
                success (res) {
                  console.log(res,11111)
                  that.card_input=res.result
                  that.$apply()
                }
            })
        },
        async check_bind(){
            if(!this.card_input||this.card_input.length<5) return wepy.Toast('请输入正确卡号','none')
            let params={
                // eid: 'LS000000',
            eid: this.$parent.globalData.eid,
            // vid: '190000000001056',
            bindingcard: this.card_input,
            vid: this.$parent.globalData.vipInfo.vid
            }
            const {data:res} = await wepy.post2('/wx/wxi/vip/binding', params)
            console.log(res,'绑定会员')
            if(!res.statu){
                wepy.Toast('绑定失败')
                this.shibai_bind=true
                this.no_bind=false
                this.success_bind=false
                this.old_bind=false
                this.$apply()
                return
            }
            // 显示绑定成功页面
            this.no_bind=false
            this.old_bind=false
            this.shibai_bind=false
            this.success_bind=true
            this.card_num=res.bindingcard
            this.$apply()
        },
        // 返回
        go_back(){
            wepy.navigateBack({
                delta: 1
              })
        }
    }
    // 计算函数
    computed = {

    }
}