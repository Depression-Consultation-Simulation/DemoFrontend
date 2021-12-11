import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import wx from 'weixin-js-sdk';
import vueTouch from 'kim-vue-touch'
import './element-variables.scss';
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts;
Vue.use(vueTouch);
//缓存
// localStorage.setItem("access_token", "44_VDtLdOoNh-IfAmD6ZJBuAgBizoaZ0IVFHbR-VEGCQkJ1BQcIsacZRMSXEvvtjSJxaWHayJ8JzG9A--zzF8uRWLYpNyRV-1hnT7xIp_2jxeUZkQmqNSm13prmoOpoIuWZMf5g7BmWO0ZLcEIQQZHiAJAVEM");
// localStorage.setItem("jsapi_ticket", "LIKLckvwlJT9cWIhEQTwfIb5PltSU7Tf6GzoiWysgCKoPommHIg30dNYMhG901sE-1JCWDJcgmLRluwX8d_oxg")
import axios from "axios";
let sha1 = require("sha1");
//轮询查询
// getTicket();
// setInterval(()=>{
//   getTicket();
// }, 1000 * 60 * 60);
//获取秘钥
function getTicket() {
  let url = "https://funingx.ugsg.com.cn:61080/WxService/wx_parm/get";
  axios
    .get(url)
    .then((res) => {
      let miyao = res.data.wxtokenticket;
      console.log(res, "///");
      if (miyao) {
        //必须缓存wx要求
        localStorage.setItem("access_token", miyao.access_token);
        localStorage.setItem("jsapi_ticket", miyao.ticket);
        let str = "jsapi_ticket=" + miyao.ticket;
        str += "&noncestr=test&timestamp=1620294845&url=https://yangssea.github.io/";
        let qianm = sha1(str);
        setWx(qianm);
      }
    })
    .catch((err) => {
      console.log(err.message, "???");
    });
}
//jssdk相关设置
function setWx(sign) {
  console.log('签名', sign)
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wx3fc5922d4d15ff67', // 必填，公众号的唯一标识
    timestamp: 1620294845, // 必填，生成签名的时间戳
    nonceStr: "test", // 必填，生成签名的随机串
    signature: sign,// 必填，签名，见附录1
    // 必填，需要使用的JS接口列表，所有JS接口列表见官方js接口
    // 这里配置录音所需要的接口权限
    jsApiList: [
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'translateVoice',
      'playVoice',
      'pauseVoice',
      'stopVoice',
      'onVoicePlayEnd',
      'uploadVoice',
      'downloadVoice'
    ]
  });

  wx.ready(function () {
    console.log("微信接口调用");
  });
  wx.checkJsApi({
    jsApiList: ['startRecord'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
    success: function (res) {
      console.log([res, '114'])
      // store.commit('jsApiList', res)
      // 以键值对的形式返回，可用的api值true，不可用为false
      // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
    }
  })
  wx.error(function (res) {
    console.log(res, '///;;;');
  });
  Vue.prototype.$wx = wx
}

Vue.use(ElementUI);

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app')
