import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        
    }
    // 页面切换显示
    onShow() {
    }
    // 页面加载
    onLoad() {
        
    }

    
    // 处理事件函数
    methods = {
        go_call(){
            console.log('打电话');
            wepy.makePhoneCall({
                phoneNumber: '4006579078' //仅为示例，并非真实的电话号码
              })
        },
        
    }
    // 计算函数
    computed = {

    }
}