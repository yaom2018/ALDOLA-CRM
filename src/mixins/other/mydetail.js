import wepy from 'wepy'
import tool from '@/mixins/tool/tool'
import QR from "@/mixins/tool/wxqrcode.js"
// import barcode  from "@/mixins/tool/barcode.js"
// import qrcode from'@/assets/qrcodejs/qrcode'
export default class Home extends wepy.mixin {
  data = {
    userInfo: null,
    vipInfo: null,
    uncouponnum: 0, //所有已领取未使用的优惠券
    qrcode: '',
    BARImgUrl: ''
  }
  async onShow() {
    const res = await this.$parent.getcounon(0)
    console.log(res)
    if(!res.statu){
      console.log(res.mes)
      return 
    }
    console.log(res,6666);
    
    this.uncouponnum=res.total
    this.$apply()
  }
  onLoad() {
    wx.showLoading({
      title: '加载中'
    })

    this.getMessage()



  }
  // 下拉刷新
  onPullDownRefresh() {}
  //适配不同屏幕大小的canvas
  getQRCodeSize() {
    var size = 0;
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 278; //不同屏幕下QRcode的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      size = width;

    } catch (e) {
      // Do something when catch error
      // console.log("获取设备信息失败"+e);
    }
    return size;
  }
  createQRCode(text, size) {
    //调用插件中的draw方法，绘制二维码图片

    let that = this

    // console.log('QRcode: ', text, size)
    let _img = QR.createQrCodeImg(text, {
      size: parseInt(size)
    })
    that.qrcode = _img
    this.$apply()
  }





  //    获取全局的所有信息
  getMessage() {
    if (this.$parent.globalData.vipInfo) {
      this.userInfo = this.$parent.globalData.userInfo
      this.vipInfo = this.$parent.globalData.vipInfo
      this.$apply()
      //   生成条形码
      tool.barcode('barcode', this.vipInfo.cardnum, 750, 150)
      setTimeout(() => {
        // 利用插件生成二维码图片
        let qrcodeSize = this.getQRCodeSize()
        this.createQRCode(this.vipInfo.cardnum, qrcodeSize)
        // 获取画布的图像信息
        this.saveCanvas()
        wx.hideLoading()
      }, 500);
    }
  }


  // 获取条形码画布的图像信息
  saveCanvas() {
    wx.canvasToTempFilePath({
      canvasId: 'barcode',
      success: (res) => {
        this.BARImgUrl = res.tempFilePath
        this.$apply()
      },
      fail(res) {
        console.log(res);
      }
    })
  }



  methods = {
    // 前往优惠券
    toCounon() {
      wx.navigateTo({
        url: '/pages/other/mycounon'
      })
    },
    // 前往积分明细
    toIntegral(){
        wx.navigateTo({
          url: '/pages/other/integral'
        })
    },
    // 返回个人中心
    toback() {
      wx.switchTab({
        url: '/pages/tabs/member'
      })
    },
  }
  // 计算函数
  computed = {

  }
}
