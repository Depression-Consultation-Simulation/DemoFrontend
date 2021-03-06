import Recorder from 'recorder-core/recorder.mp3.min';
import axios from "axios";
import {baseUrl} from "../util/index.js";
//简单控制台直接测试方法：在任意(无CSP限制)页面内加载Recorder，加载成功后再执行一次本代码立即会有效果，import("https://xiangyuecn.gitee.io/recorder/recorder.mp3.min.js").then(function(s){console.log("import ok")}).catch(function(e){console.error("import fail",e)})

let rec;
let audios;
/**调用open打开录音请求好录音权限**/
let recOpen = function (success) {//一般在显示出录音按钮或相关的录音界面时进行此方法调用，后面用户点击开始录音时就能畅通无阻了
    rec = Recorder({
        type: "mp3", sampleRate: 16000, bitRate: 16 //mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
    });
    //var dialog=createDelayDialog(); 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
    rec.open(function () {//打开麦克风授权获得相关资源
        //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
        rec.start();// 此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程
        console.log('成功打开录音');
        // success && success();
    }, function (msg, isUserNotAllow) {//用户拒绝未授权或不支持
        //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
        console.log((isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg);
    });
}


/**结束录音**/
function recStop() {
    rec.stop(function (blob, duration) {
        console.log('录音结束成功');
        console.log(blob, (window.URL || webkitURL).createObjectURL(blob), "时长:" + duration + "ms");
        rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
        rec = null;

        //已经拿到blob文件对象想干嘛就干嘛：立即播放、上传

        /*** 【立即播放例子】 ***/
        // audios[i] = document.createElement("audio");
        // audios[i].style.width = 0;
        // audios[i].style.height = 0;
        // audios[i].controls = true;
        // document.body.appendChild( audios[i]);
        // //简单利用URL生成播放地址，注意不用了时需要revokeObjectURL，否则霸占内存
        // audios[i].src = (window.URL || webkitURL).createObjectURL(blob);
        audios = blob;
        console.log('录音结束成功', audios);
        // audios[i].play();
        // audios[i] = (window.URL || webkitURL).createObjectURL(blob);
        // localStorage.setItem();
    }, function (msg) {
        console.log("录音失败:" + msg);
        rec.close();//可以通过stop方法的第3个参数来自动调用close
        rec = null;
    });
}

export {recOpen, recStop, audios};