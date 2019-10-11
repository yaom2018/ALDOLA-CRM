import wepy from 'wepy'
export default class Home extends wepy.mixin {
  data = {
    userInfo: null,
    vipInfo: null,
    allCoupons: [], //所有可领取的优惠券
    uncouponnum: 0, //所有已领取未使用的优惠券
    showgift: false, //礼包弹框
    ConfirmButton: false, //弹框确定按钮
    getCouponarr: [],
    // 当前等级所需积分
    gradepoint: 300
  }
  onShow() {
    console.log(111);

    wepy.showLoading({
      title: '加载中'
    })
    this.showgift = this.$parent.globalData.showgift
    // 获取数据
    this.getMessage()

    if (this.vipInfo) {
      // 第一次获取未使用的优惠券
      this.$parent.getcounon(0)
      if (this.$parent.globalData.uncouponnum > 0) {
        this.uncouponnum = this.$parent.globalData.uncouponnum
      }
      // 全局执行完之后执行下面
      this.$parent.getcounonCallback = res => {
        console.log(res, '未使用的优惠券回调');
        if (res.statu) {
          this.uncouponnum = res.rows.length
          this.$apply()
        }

      }
      wepy.hideLoading()
    }
  }
  onLoad() {

  }
  // 下拉刷新
  onPullDownRefresh() {

  }
  //    获取全局的所有信息
  getMessage() {
    if (this.$parent.globalData.vipInfo) {
      this.userInfo = this.$parent.globalData.userInfo
      this.vipInfo = this.$parent.globalData.vipInfo
      this.$apply()
    } else {
      this.vipInfoReadyCallback = res => {
        console.log('vipuserback');
        this.userInfo = this.$parent.globalData.userInfo
        this.vipInfo = this.$parent.globalData.vipInfo
        this.$apply()
      }
    }
    // 获取完全局，再获取优惠券,
    // this.loadCoupons()
  }
  // 获取所有优惠券
  // async loadCoupons() {
  //     let params = {
  //         eid: this.$parent.globalData.vipInfo.eid,
  //         vipid: this.$parent.globalData.vipInfo.vid
  //     }
  //     // console.log(params);
  //     const { data: res } = await wepy.post('/coupon/getecoupons', params)
  //     console.log(res,'未领取的优惠券');
  //     if (res.statu) {
  //         // 如果有优惠券就显示礼包弹框
  //         this.showgift = true
  //         this.allCoupons = res.rows
  //         this.$apply()

  //     }

  // }
  // 领取优惠券
  // async getEcoupon(id) {
  //     wx.showLoading({
  //         title: '正在领取'
  //     })
  //     let params = {
  //         mid: id,
  //         eid: this.$parent.globalData.vipInfo.eid,
  //         vipid: this.$parent.globalData.vipInfo.vid
  //     }
  //     const { data: res } = await wepy.post('/coupon/getcoupon', params)
  //     console.log(77777777);

  //     if (!res.statu) return wepy.Toast(res.mes, 'none')
  //     this.getCouponarr.push(1)
  //     // 优惠券全部领取完之后执行回调函数
  //     if (this.getCouponarr.length == this.allCoupons.length) {
  //         console.log('已经领取完了');
  //         wx.hideLoading()
  //         this.showgift = false
  //         this.$apply()
  //         wepy.Toast(res.mes, 'success')
  //         console.log(this, '领取完');
  //         this.getCouponstop()
  //     }
  // }
  methods = {
    toCoupon() {
      wx.navigateTo({
        url: '/pages/other/mycounon'
      })
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
        fail(res){
            console.log('fail');
        }
      })
    },
    // 点击一次性领取所有优惠券
    // getAllCoupon() {
    //     console.log('领取中');
    //     this.allCoupons.forEach((item) => {
    //         console.log(item.id);
    //         this.getEcoupon(item.id)

    //     })
    //     // 异步领取优惠券结束,查询已领取的优惠券数量
    //     this.getCouponstop = res => {
    //         // 第二次获取未使用的优惠券
    //         this.$parent.getcounon(0)
    //         if(this.$parent.globalData.uncouponnum>0){
    //             this.uncouponnum=this.$parent.globalData.uncouponnum
    //         }
    //         // 全局执行完之后执行下面
    //         this.$parent.getcounonCallback2 = res => {
    //             console.log(res, 999999);
    //             if (res.statu) {
    //                 this.uncouponnum = res.rows.length
    //                 this.$apply()
    //             }

    //         }
    //     }


    // },
    // 关闭弹框
    closegift() {
      this.showgift = false
    },
    // 前往会员详情
    toMydetail() {
      wx.navigateTo({
        url: '/pages/other/mydetail'
      })
    },
    // 完善信息
    to_toInformation() {
      wepy.navigateTo({
          url: '/pages/other/information'
      })
  },
    // 前往优惠券
    toCounon() {
      wx.navigateTo({
        url: '/pages/other/mycounon'
      })
    },

  }
  // 计算函数
  computed = {

  }
}
