import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        nocoupon: 'block',
        coupons: ''
    }
    // 页面切换显示
    onShow() {
        // 如果没有登录就强制跳转
        // if (!this.$parent.globalData.logincheck) {
        //     wepy.navigateTo({
        //         url: '/pages/other/login'
        //     })
        //     return 
        // }
    }
    // 页面加载
    onLoad() {
        // if(this.$parent.globalData.logincheck){
             this.loadCoupons(this);
        //     console.log('cate页加载');
        // }
        
    }

    async loadCoupons(_this) {
        let params = {
            eid: this.$parent.globalData.vipInfo.eid,
            vipid: this.$parent.globalData.vipInfo.vid
        }
        console.log(params);
        const res = await wepy.post('/coupon/getecoupons', params)
        console.log(res.data, 666666666);
        let data = res.data
        // console.log(data.statu, 9);
        if (data.statu) {
            // console.log(1111);

            this.nocoupon = 'none',
                this.coupons = data.rows
            this.$apply()
        }
    }
    // 处理事件函数
    methods = {
        async getEcoupon(e) {
            var _this = this;
            // console.warn(e.currentTarget.id);
            wx.showLoading({
                title: '正在领取'
            })
            let params = {
                    mid: e.currentTarget.id,
                    eid: this.$parent.globalData.vipInfo.eid,
                    vipid: this.$parent.globalData.vipInfo.vid
            }
            const { data: res } = await wepy.post('/coupon/getcoupon', params)
            // console.log(res);
            if(!res.statu) return wepy.baseToast(res.mes)
            wx.hideLoading()
            wepy.baseToast(res.mes)
            this.loadCoupons(_this)
        }

    }

    // 计算函数
    computed = {

    }
}