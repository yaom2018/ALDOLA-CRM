import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        nocoupon: 'block',
        coupons: '',
        limit: 20,
        offset: 0,
        // 是否显示
        isLoading: false
    }
    // 页面切换显示
    onShow() {
        this.loadCoupons(this,false)
        
    }
    // 页面加载
    onLoad() {
        
        
    }
    // // 上拉加载事件
    // onReachBottom() {
    //     console.log('上拉加载');
    //     this.offset=this.limit+this.offset
    //     if(this.offset>this.total){
    //         console.log('到底了')
    //         this.isLoading=true
    //         this.$apply()
    //         return
    //     }
    //     this.loadCoupons(this,false)
    // }
    async loadCoupons(_this,flag) {
        console.log(this.$parent.globalData);
        
        if(!this.$parent.globalData.vipInfo){
            wepy.Toast('请登录')
            return
        }
        let params = {
            limit: this.limit,
            offset: this.offset,
            p: {
                eid: this.$parent.globalData.vipInfo.eid,
                wxid: this.$parent.globalData.datames.openid,
                vipid: this.$parent.globalData.vipInfo.vid
            }
            
        }
        const {data:res} = await wepy.post('/coupon/getecoupons', params)
        console.log(res, '可用优惠券')
        // console.log(data.statu, 9);
        if(!res) return wepy.Toast('服务器无响应')
        if (res.statu) {
            this.nocoupon = 'none',
            this.coupons = res.rows
            this.$apply()
        }else {
            wepy.Toast('暂无优惠券')
            this.coupons = []
              this.$apply()
          }
          if(flag){
            wepy.Toast('领取成功','success')
          }
    }
    // 处理事件函数
    methods = {
        async getEcoupon(e) {
            var _this = this;
            // console.warn(e.currentTarget.id);
            wepy.Toast('正在领取')
            let params = {
                    mid: e.currentTarget.id,
                    eid: this.$parent.globalData.vipInfo.eid,
                    vipid: this.$parent.globalData.vipInfo.vid
            }
            const { data: res } = await wepy.post('/coupon/getcoupon', params)
            
            // console.log(res);
            if(!res.statu) return  wepy.Toast(res.mes)
            this.loadCoupons(_this,true)
        }

    }

    // 计算函数
    computed = {

    }
}