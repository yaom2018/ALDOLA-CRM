import wepy from 'wepy'
import tool from '@/mixins/tool/tool'
export default class Home extends wepy.mixin {
    data = {
        userInfo: null,
        vipInfo: null,
        uncouponnum: 0,//所有已领取未使用的优惠券
        
    }
    onShow() { }
    onLoad() {
        wx.showLoading({
            title: '加载中'
        })
        this.getMessage()
        
        
    }
    // 下拉刷新
    onPullDownRefresh() {

    }
    //    获取全局的所有信息
    getMessage(){
        if (this.$parent.globalData.vipInfo) {
            this.userInfo=this.$parent.globalData.userInfo
            this.vipInfo=this.$parent.globalData.vipInfo
            this.$apply()
            wx.hideLoading()
        }
        // 获取优惠券数量
        if (this.vipInfo) {
            // 第一次获取未使用的优惠券
            this.$parent.getcounon(0)
            if(this.$parent.globalData.uncouponnum>0){
                this.uncouponnum=this.$parent.globalData.uncouponnum
            }
            // 全局执行完之后执行下面
            this.$parent.getcounonCallback = res => {
                console.log(res, 9999);
                if (res.statu) {
                    this.uncouponnum = res.rows.length
                    this.$apply()
                }

            }
            // 获取二维码
            tool.qrcode('qrcode', this.vipInfo.cardnum, 450, 450)
            wepy.hideLoading()
        }
        
    }

    methods = {
        // 前往优惠券
        toCounon() {
            wx.navigateTo({
                url: '/pages/other/mycounon'
            })
        },
        // 返回个人中心
        toback() {
            wx.switchTab({
                url: '/pages/tabs/member'})
        },
    }
    // 计算函数
    computed = {

    }
}