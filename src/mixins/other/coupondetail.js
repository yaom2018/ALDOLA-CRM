import wepy from 'wepy'
import tool from '@/mixins/tool/tool'
export default class Home extends wepy.mixin {
    data = {
        // 当前优惠券详情
        coupon:[]
        
    }
    onShow() { }
    onLoad(options) {
        console.log(options,'当前优惠券详情');
        this.coupon=options
        this.$apply()
        tool.qrcode('qrcode', this.coupon.cid, 200, 200);
    }
    // 下拉刷新
    onPullDownRefresh() {

    }
    

    methods = {
        // 前往会员详情
        toMydetail(){
            wx.navigateTo({
                url: '/pages/other/mydetail'})
        }
    }
    // 计算函数
    computed = {

    }
}