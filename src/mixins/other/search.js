import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        searchValue:''
        
    }
    onShow() { }
    onLoad() {
       
    }
    // 下拉刷新
    onPullDownRefresh() {

    }
    

    methods = {
        search(e){
            // input双向绑定
            this.searchValue=e.detail.value
        },
    }
    // 计算函数
    computed = {

    }
}