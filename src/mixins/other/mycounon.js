import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        active: 0,//当前
        unused: 0,//未使用
        uncounon: [],
        byused: 0,//已使用
        bycounon: [],
        outused: 0,//已过期
        outcounon: [],
    }
    // 页面切换显示
    onShow() {
    }
    // 页面加载
    onLoad() {
        // wepy.Load()


        // this.counonCallback = res => {
        //     console.log(res);

        //   }
        // 获取三种优惠券
        this.getcounon(0)
        this.getcounon(2)
        this.getcounon(3)

        //   wepy.hLoad()
    }
    // 获取优惠券
    async getcounon(types) {
        wepy.Load()
        // 发请求
        let params = {
            eid: this.$parent.globalData.vipInfo.eid,
            vipid: this.$parent.globalData.vipInfo.vid,
            ctype: types
        }
        const { data: res } = await wepy.post('/coupon/getmycoupon', params)
        console.log(res,'获取我的优惠券');
        if (res.statu) {
            if (types == 0) {
                this.uncounon = res.rows
            } else if (types == 2) {
                this.bycounon = res.rows
            } else if (types == 3) {
                this.outcounon = res.rows
            }
            this.$apply()
        }

        wepy.hLoad()
    }
    // 处理事件函数
    methods = {
        onChange(event) {
            let types = 0
            if (event.detail.index == 0) {
                types = 0
            } else if (event.detail.index == 1) {
                types = 2
            } else if (event.detail.index == 2) {
                types = 3
            }
            // 切换tab栏，重新刷新优惠券
            this.getcounon(types)
            console.log(event.detail.index, types);

            // wx.showToast({
            //     title: `切换到标签 ${event.detail.index + 1}`,
            //     icon: 'none'
            // });
        },
        // 前往优惠券详情页
        couponDetail(e) {
            // if (this.data.toDetail){
            //     wx.setStorageSync('id', e.currentTarget.dataset.id)
            //     wx.setStorageSync('cid', e.currentTarget.dataset.cid)
            //     // console.log(e.currentTarget.dataset.id);
            //     wepy.navigateTo({
            //       url: '/packageA/pages/other/coupondetail?id=' + e.currentTarget.dataset.id + '&cid=' + e.currentTarget.dataset.cid
            //     });
            // }
        },
        // 前往优惠券详情
        tocounonDetail(e) {
            console.log(e.currentTarget.dataset.presentcoupon,'前往指定优惠券信息');
            let coupon=e.currentTarget.dataset.presentcoupon
            wepy.navigateTo({
                url:'/pages/other/coupondetail?cid='+coupon.cid+'&cname='+coupon.cname+'&cname='+coupon.cname+'&mmoney='+coupon.mmoney+'&cname='+coupon.cname+'&startimeStr='+coupon.startimeStr+'&endtimeStr='+coupon.endtimeStr+'&sum='+coupon.sum
            })
        },
        // 前往领券
        tocoupon() {

            

            // wepy.navigateTo({
            //     url:'/pages/other/coupondetail'
            // })
        }
    }
    // 计算函数
    computed = {

    }
}