import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        height: 0,
        // 积分升级状态
        level: true,
        // 积分升级成功
        success_level: false,
        // 积分升级失败
        noting_level: false,
        // 已升级过
        old_level: false,
        // 会员信息
        vipInfo: 0,
    }
     // 页面加载
     onReady(){
        const res = wx.getSystemInfoSync()
        console.log(res);
        this.height='height:'+res.windowHeight+'px'
        this.$apply()
    }
    // 页面切换显示
    async onShow() {
        // 查询积分
        let getparamres = await this.$parent.getVipInfo2()
        console.log(getparamres,'会员信息')
        if(!getparamres.statu){
            console.log('查询会员信息失败')
            this.vipInfo=this.$parent.globalData.vipInfo
        }else {
            console.log('查询会员信息查询成功')
            this.vipInfo=getparamres.t
        }
        if(getparamres.t.qpname=='金卡会员'){
            this.level=false
            this.old_level=true
        }
        this.$apply()
    }
    // 页面加载
    onLoad() {
        console.log('积分升级')
        
    }
    onHide(){
        // 初始化
        this.level=true
        this.noting_level=false
        this.success_level=false
        this.$apply()
    }
    
    // 处理事件函数
    methods = {
        // 确认升级
        async confirm_level(){
            console.log('升级')
            let params = {
                eid: this.$parent.globalData.eid,
                wxid: this.$parent.globalData.openid,
                phone: this.$parent.globalData.vipInfo.phone
            }
            const {data:res} = await wepy.post2('/wx/wxi/vip/point/upgrade', params)
            console.log(res,'检测是否升级')
            if(!res) return wepy.Toast('服务器无响应')
            if(!res.statu){
                wepy.Toast('升级失败')
                this.level=false
                this.noting_level=true
                this.$apply()
                return
            }
            // 升级成功
        
            this.level=false
            this.success_level=true
            
            let getparamres = await this.$parent.getVipInfo2()
            console.log(getparamres,'会员信息')
            if(!getparamres.statu){
                console.log('查询会员信息失败')
                this.vipInfo=this.$parent.globalData.vipInfo
            }else {
                console.log('查询会员信息查询成功')
                this.vipInfo=getparamres.t
            }
            this.$apply()
        },
        // 取消升级
        cancel_level(){
            console.log('取消升级')
            wx.navigateBack({
                delta: 1
              })
              
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