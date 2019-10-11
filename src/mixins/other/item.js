import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        userInfo: null,
        vipInfo: null
        
    }
    onShow() { }
    onLoad() {
        // wepy.showLoading({
        //     title: '加载中'
        // })
        // console.log(this.$parent);
        // // 获取数据
        // this.getMessage()
        // if(this.vipInfo){
        //     wepy.hideLoading()
        // }
    }
    // 下拉刷新
    onPullDownRefresh() {

    }
    //    获取全局的所有信息
    // getMessage(){
    //     if (this.$parent.globalData.vipInfo) {
    //         this.userInfo=this.$parent.globalData.userInfo
    //         this.vipInfo=this.$parent.globalData.vipInfo
    //         this.$apply()
    //     } else {
    //         this.vipInfoReadyCallback = res => {
    //             console.log('vipuserback');
    //             this.userInfo=this.$parent.globalData.userInfo
    //             this.vipInfo=this.$parent.globalData.vipInfo
    //             this.$apply()
    //         }
    //     }
    // }

    methods = {
        // 前往会员详情
        // toMydetail(){
        //     wx.navigateTo({
        //         url: '/pages/other/mydetail'})
        // }
    }
    // 计算函数
    computed = {

    }
}