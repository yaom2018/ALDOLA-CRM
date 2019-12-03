import wepy from 'wepy'
import tool from '@/mixins/tool/tool'
export default class Home extends wepy.mixin {
    data = {
        // 积分明细
        jifenList: [],
        // 每页条数
        limit: 50,
        // 起始条数
        offset: 0,
        // 查询的总数
        total: 0,
        // 是否停止刷新
        isrefreshStop: false,
        // 是否显示触底白框
        isLoading: false
    }
    onShow() { }
    onLoad() {
      console.log(this.$parent.globalData);
        this.getjifen()
    }
    // 下拉刷新
    onPullDownRefresh() {}
    // 上拉加载
    onReachBottom(){
      console.log('上拉加载');
      
      this.offset=this.offset+this.limit+1
      // 如果起始条数大于等于总条数，就停止上拉刷新
      if(this.offset>=this.total){
        this.isLoading = true
        return
      }
      // 请求积分明细列表
      this.getjifen()
    }
    
// 积分
async getjifen(){
    let params={
        limit: this.limit,
        offset: this.offset,
      p: {
        vipid: this.$parent.globalData.vipInfo.vid,
        // vipid: '530098411160990',
        // eid: 'LS000000',
        eid: this.$parent.globalData.eid
      }
    }
    console.log(params);
    
    // let arr=this.jifenList.filter(item=>item.time=tool.formatTime(item.time,'Y-M-D h:m:s'))
    // console.log(arr);
    const {data:res}=await wepy.post2('/wx/wxi/score/getscoredetail',params)
    // const {data:res}=await wepy.posttest('http://192.168.10.129:9091/wx/wxi/score/getscoredetail',params)
    console.log(res,'积分')
    if(!res.statu) return wepy.Toast(res.mes)
    
    let arr=res.rows.filter(item=>item.createtime=tool.formatTime(item.createtime,'Y-M-D h:m:s'))
    console.log(arr);
    // this.jifenList=arr
    this.jifenList = [...this.jifenList, ...arr]
    this.total=res.total
    this.$apply()
    
    
  }
    methods = {
        
    }
    // 计算函数
    computed = {

    }
}