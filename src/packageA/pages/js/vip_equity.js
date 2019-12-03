import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        
    }
    // 页面切换显示
    onShow() {
    }
    // 页面加载
    onLoad() {
        console.log(1111);
        
    }

    
    // 处理事件函数
    methods = {
        go_back(){
            wepy.navigateBack({
                delta: 1
              })
        }
    }
    // 计算函数
    computed = {

    }
}