<template>
    <div class="content">
        <Interpretation />
        <Portrait v-bind:userId="userId"/>
        <div class="home-layout" v-loading="fanyiLoading" :class="isIos?'h-ios home-layout':'home-layout'">
        <el-dialog
                title="评测指标"
                :visible.sync="centerDialogVisible"
                width="80%"
                center>
            <div v-for="(metric,index) in metrics">
                <li style="color: gray; width: 100%;">{{metric}}</li>
                <div v-if="examples[index]" style="background-color: #deebed;padding: 20px;color: gray;margin: 10px">
                    <div><i class="el-icon-success" style="color:#67C23A; "></i> 正例</div>
                    <div style="white-space: pre-line;">{{examples[index]["right"]}}</div>
                    <div><i class="el-icon-error" style="color: #E6A23C "></i> 反例</div>
                    <div style="white-space: pre-line">{{examples[index]["wrong"]}}</div>
                </div>
            </div>
        </el-dialog>
        <el-dialog
                title="对话体验评价"
                :visible.sync="scoreDialogVisible"
                width="80%"
                center>
            <div style="padding-left:10%;padding-right: 10%;margin-bottom: 20px;color: grey">您可暂时关闭该窗口，复盘对话后，点击绿色按钮可以再次打开</div>
            <el-form ref="form" :model="score_bot2" style="padding-left:8%;padding-right: 8%">
                <el-form-item>
                    <li >1. {{metrics[0]}}</li>
                    <el-slider
                            v-model="score_bot2.score1"
                            :step="1"
                            :max="5"
                            style="width: 80%;margin-left:5%"
                            show-stops>
                    </el-slider>
                </el-form-item>
                <el-form-item >
                    <li> 2. {{metrics[1]}}</li>
                    <el-slider
                            v-model="score_bot2.score2"
                            :step="1"
                            :max = "5"
                            style="width: 80%;margin-left:5%"
                            show-stops>
                    </el-slider>
                </el-form-item>
                <el-form-item >
                    <li>3. {{metrics[2]}}</li>
                    <el-slider
                            v-model="score_bot2.score3"
                            :step="1"
                            :max = "5"
                            style="width: 80%;margin-left:5%"
                            show-stops>
                    </el-slider>
                </el-form-item>
                <el-form-item >
                    <li>4. {{metrics[3]}}</li>
                    <el-slider
                            v-model="score_bot2.score4"
                            :step="1"
                            :max = "5"
                            style="width: 80%;margin-left:5%"
                            show-stops>
                    </el-slider>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit">提 交</el-button>
            </span>
        </el-dialog>

        <div class="h-body" id="hBody">
            
            <div @click="clearData" class="delete-talk">
                <i class="el-icon-delete"></i>
            </div>
            <div @click="centerDialogVisible = true" class="delete-talk2">
                <i class="el-icon-question"></i>
            </div>
            <div @click="openScoreWindow"  class="delete-talk3">
                <i class="el-icon-score">&#9733;</i>
            </div>
            <div :class="item.sign === 'vioce' || item.sign === 'msg' ? 'right-msg' : ''"
                    v-for="(item, index) of list"
                    :key="index + 'ds'">
                <div v-if="item.time" class="time">
                    {{ item.time }}
                </div>

                <img v-if="(item.sign == null||item.sign === 'first')" :src="img.left" class="userImg"/>

                <div class="txt1" v-if="item.sign === 'first'">
                    <div>
                        hi～我是心理健康助手小驰<b style="color: #9abdf9">二号</b>，和我打个招呼吧!
                    </div>
                </div>

                <div
                        @click="playVioce(index, item.sign)"
                        v-if="item.sign !== 'first'"
                        :class="item.sign == null ? 'txt1' : 'txt'"
                >
                    <div style="display: flex; text-align: right" v-if="item && item.sign == 'vioce'">
                        <div style="margin-left: 10px">{{ item.lengths }}"</div>
                        <img class="playImg"
                             :src="audioId !== item.id?require('../assets/msgLInk1.png'):require('../assets/msgLInk0.png')">
                    </div>

                    <span style="position: relative">
<!--                        <el-tag v-if="item.topic" style="color: #9abdf9;margin-right: 10px">{{item.topic}}</el-tag>-->
                        <span>{{ item.msg }}</span>
                    </span>
                </div>

                <img v-if="item.sign != null && item.sign !== 'first'" :src="img.right" class="userImg"/>
                <div
                        v-if="item.sign == 'vioce' && item.msg && item.msg.length > 0"
                        class="fanyi"
                >
                    <div>{{ item.msg }}</div>
                </div>
            </div>
        </div>

        <div class="h-foot">
<!--            <img-->
<!--                    @click="changeTab"-->
<!--                    :src="keyState ? img.vioce : img.keys"-->
<!--                    style="width: 2.5rem;height: 2.5rem"-->
<!--            />-->
<!--            <div class="btn-parent" v-show="!keyState">-->
<!--                <el-button @mousedown.native="enter1" @mouseup.native="leave1" v-swipeup="cancelSend"-->
<!--                           @touchstart.native="enter" @touchend.native="leave"-->
<!--                ><strong>{{ loading ? "松开 发送" : "按住 说话" }}</strong></el-button-->
<!--                >-->
<!--            </div>-->
            <el-input
                    v-show="keyState"
                    placeholder="请输入"
                    v-model="msg"
                    @keyup.enter.native="sendMsg(undefined, undefined, 'jl')"
            ></el-input>
            <img :src="img.send" @click="sendMsg(undefined, undefined, 'jl')"/>
        </div>
        <!-- 弹框 -->
        <div v-if="loading" class="vioce-model">
            <img :src="vioceImgList[gifImg]"/>
            <div>上滑取消</div>
        </div>
    </div>
    </div>
</template>

<script>
    import question from "../mock/index";
    import {baseUrl, browserRedirect, examples, metrics} from "../util/index";
    import axios from "axios";
    import moment from "moment";
    import {recOpen, recStop, audios} from './recorder';
    import Report from "./Report";
    import $ from 'jquery'
    import Interpretation from "./Interpretation";
    import Portrait from "./Portrait";
    //document.getElementById('zhezhao').style.display="";
    

    export default {
        components: {Interpretation, Portrait, Report},
        data() {
            return {
                isPc: true,
                audio: null,
                audioId: null,
                audioTwo: null,
                audioTwoId: null,
                audioNew: '',
                audioTime: null,
                fanyiLoading: false,
                clickSum: 0,//0：文本；1：语音；2：预约挂号；3：复诊开方4：支付缴费5：账号相关6：住院须知；7：就医建议；
                img: {
                    back: require("../assets/back.png"),
                    left: require("../assets/doctorIcon.png"),
                    right: require("../assets/user-bg.png"),
                    send: require("../assets/send.png"),
                    vioce: require("../assets/speak.png"),
                    keys: require("../assets/keys.svg"),
                },
                isClear: false,
                isIos: false,
                radio: '',
                selectedList: [],
                url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                goodImg: {
                    down: require('../assets/goodDown.png'),
                    down1: require('../assets/isGoodDown.png'),
                    up: require('../assets/goodUp.png'),
                    up1: require('../assets/isGoodUp.png')
                },
                msg: "",
                mindList: [],
                vioceImgList: [],
                serveList: [
                    {name: "预约挂号", img: "s1"},
                    {name: "复诊开方", img: "s3"},
                    {name: "支付缴费", img: "s4"},
                    {name: "账号相关", img: "s6"},
                    {name: "住院须知", img: "s2"},
                    {name: "意见建议", img: "s5"},
                ],
                gifImg: 0,
                isWeixin: false,
                vioceTime: 0,
                loadingChange: false,
                loadingOther: false,
                timer: null,
                loading: false,
                isRecord: true,
                mindView: false,
                keyState: true,
                token: "",
                list: [],
                id: "",
                firstPlay: null,
                sessionId: "",
                centerDialogVisible: false,
                context: [],
                realid: 0,
                score_bot2:{
                    score1: 0,
                    score2: 0,
                    score3: 0,
                    score4: 0,
                },
                scoreDialogVisible: false,
                metrics:metrics,
                userId: -1,
                examples: examples
            };
        },

        watch: {
            
            // msg(val) {
            //     if (this.msg.length === 0 || this.msg == null) {
            //         this.mindView = false;
            //         return;
            //     }
            //     this.mindList = [];
            //     let url = baseUrl + "/WxService/DataExchange?query=";
            //     url += this.msg;
            //     axios
            //         .get(url)
            //         .then((res) => {
            //             //console.log('!');
            //             if (this.msg && this.msg.length > 0) {
            //                 this.mindView = true;
            //                 //console.log('!');
            //                 this.mindList = [];
            //                 if (res && res.data && res.data.result) {
            //                     let list = res.data.result;
            //                     list.forEach((e) => {
            //                         let index = e.question.indexOf(this.msg);
            //                         this.mindList.push({
            //                             value: e.question,
            //                             list: [
            //                                 index === 0 ? "" : e.question.substring(0, index),
            //                                 this.msg,
            //                                 index === e.question.length
            //                                     ? ""
            //                                     : e.question.substring(
            //                                     index + this.msg.length,
            //                                     e.question.length
            //                                     ),
            //                             ],
            //                         });
            //                     });
            //                 } else {
            //                     this.mindView = false;
            //                 }
            //             }
            //         })
            //         .catch((err) => {
            //             console.log(err);
            //         });
            // },
        },

        methods: {
            async init(){
                this.$router.onReady(() => {
                    console.log(this.$route.query.userId);
                    this.userId = this.$route.query.userId;

                });
            },
            openScoreWindow(){
                if(this.context.length<20){
                    this.$message({
                        message: '对话历史过短，请注意对话是否结束',
                        type: 'warning'
                    });
                    // return;
                }
                this.scoreDialogVisible = true

            },
            onSubmit() {
                console.log(this.score_bot2);
                console.log(this.context);
                let url = baseUrl + "/saveScores";
                axios
                    .post(url,{
                        userId: this.$route.query.userId,
                        botId: 2,
                        score: JSON.stringify(this.score_bot2),
                        history: JSON.stringify({"history": this.context})
                    })
                    .then((res) => {
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        let target = this.$route.query.userId%3 === 2?"/result":"/bot3";
                        this.$router.push({ path: target, query: {"userId": this.$route.query.userId }})
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            sumbitCheckbox() {
                let res = '';
                for (let i = 0; i < this.selectedList.length; i++) {
                    if (i != this.selectedList.length - 1)
                        res = res + this.selectedList[i] + '，';
                    else res = res + this.selectedList[i]
                }
                this.answerDetailRes(res);
                this.selectedList = [];
            },
            dianwo(){
				document.getElementById('zhezhao').style.display="";
                let body = {"id":-1,"num":-1};
                //axios
                    //.post(baseUrl,body)
                    //.then((res) => {
                        
                    //})
                    //.catch((err) => {
                        //console.log(err);
                    //});
			},
			hidder(){
				document.getElementById('zhezhao').style.display="none";
			},
            score(){
                print('G')
                //$(this).addClass('cs');
                //$(this).prevAll().addClass('cs');
                //$(this).nextAll().removeClass('cs');
            },

            changeTab() {
                this.keyState = !this.keyState;
                this.loading = false;
            },

            //上滑取消
            cancelSend() {
                this.loading = false;
            },
            //清除缓存
            clearData() {
                if (this.list.length <= 1) {
                    this.$message({
                        type: 'info',
                        message: '暂无聊天记录'
                    });
                    return;
                }
                this.$confirm('此操作将永久删除聊天文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.isClear = true;
                    localStorage.removeItem('aiHistory2');
                    this.list = [{
                        sign: 'first',
                        time0: this.getTime()
                    }];
                    this.context = []
                    // this.$message({
                    //   type: 'success',
                    //   message: '删除成功!'
                    // });
                }).catch(() => {
                    // this.$message({
                    //   type: 'info',
                    //   message: '已取消删除'
                    // });
                });
                // this.$message({
                //   type: 'info',
                //   message: '测试语音录入'
                // });
                // navigator.mediaDevices.getUserMedia(constraints)
                // .then(function(stream) {
                //   /* 使用这个stream stream */
                // })
                // .catch(function(err) {
                //   /* 处理error */
                // });
            },
            //详细问题回答
            answerDetailRes(name, index, sign) {
                if (sign === 'txt') {
                    this.clickSum = 0
                }
                this.radio = '';
                // console.log(name);
                if (this.loadingOther) return;
                if (name && name.length > 800) name = name.substring(0, 800);
                if (index == undefined) index = 0;
                if (sign !== "vioce" && name && name.length > 0) {
                    this.list.push({
                        sign: "msg",
                        msg: name,
                        year: this.getTime('year'),
                        time: this.getTime()
                    });
                    this.context.push({
                        content: name,
                        from:"patient"
                    });
                }
                this.getResult(name,index);
                this.setFoot();
            },
            //点赞
            comments(sign, index) {
                this.list[index].up = sign;
            },

            getResult(msg, index) {
                let body = {"context":this.context,"input":msg, "model": "bart"};
                // print(body)
                console.log(body);
                axios
                    .post(baseUrl+"/getResponse",body)
                    .then((res) => {
                        console.log(res);
                        this.loadingOther = false;
                        if (res) {
                            let obj = {};
                            let history = {};
                            console.log(res);
                            obj.oldIndex = index;
                            obj.year = this.getTime('year');
                            obj.time0 = this.getTime(); //咨询返回不需要添加时间
                            // obj.linkId = new Date().getTime();
                            obj.msg = res.data.response;
                            obj.sign = null;
                            obj.topic = res.data.action;
                            history.content = res.data.response;
                            history.topic = res.data.action;
                            history.from = "doctor";
                            this.list.push(obj);
                            console.log(this.list);
                            this.context.push(history);
                            if(res.data.summary){
                                this.scoreDialogVisible = true
                            }
                            this.setFoot();
                        }
                    })
                    .catch((err) => {
                        this.loadingOther = false;
                        console.log(err);
                    });

            },

            getTime(sign) {
                let time = new Date();
                if (sign === 'year') return moment(time.getTime()).format('YY');
                return moment(time.getTime()).format('MM-DD HH:mm');
            },

            //换一批
            gifImgChange() {
                if (this.timer) clearInterval(this.timer);
                this.vioceTime = 0;
                this.timer = setInterval(() => {
                    this.vioceTime++;
                    if (this.gifImg > 6) this.gifImg = 1;
                    else this.gifImg++;
                }, 100);
            },

            //安卓端和pc端语音录入停止
            enter1(e) {
                if (this.isWeixin) {
                    this.start();
                    return;
                }
                e.preventDefault();
                // this.loading = true;
                this.start();
            },

            leave1() {
                // this.loading = false;
                setTimeout(() => {
                    console.log(this.loadingChange, 'lll');
                    this.clearGif();
                    this.stop();
                }, 300);
            },

            enter(e) {
                // if (this.isPc) return;

                // this.loading = true;
                this.start();
                e.preventDefault();
            },

            leave() {
                // this.loading = false;
                // if (this.isPc) return;
                console.log(this.loadingChange);
                setTimeout(() => {
                    console.log(this.loadingChange, 'lll');
                    this.clearGif();
                    this.stop();
                }, 300);
            },

            clearGif() {
                if (this.timer) clearInterval(this.timer);
            },
            //切换输入
            changeIn() {
                this.keyState = !this.keyState;
            },
            //发送||回车
            sendMsg(data, res, sign) {
                //记录点击次数
                if (sign === 'jl') {
                    this.clickSum = 0;
                }
                if (sign === 'other') {
                    this.answerDetailRes(res, index);
                    return;
                }
                console.log(res);
                if (res != null) {
                    let index = this.getArrIndex(res);
                    this.answerDetailRes(res, index, "vioce");
                    return;
                }
                if (this.msg.length === 0) {
                    this.$message.warning("不能发送空白消息");
                    return;
                }
                let index = this.getArrIndex(this.msg);
                this.answerDetailRes(this.msg, index);
                this.msg = "";
            },
            //查找问题位置
            getArrIndex(str) {
                let obj = JSON.parse(JSON.stringify(question));
                let sum = undefined;
                obj.forEach((e, index) => {
                    e.list.forEach((es) => {
                        if (es.name.indexOf(str) !== -1) {
                            sum = index;
                        }
                    });
                });
                return sum;
            },
            //开始录音
            start() {
                console.log(this.isPc);

                if (this.isPc && this.isWeixin) {
                    this.$message.info('微信pc端不支持录音，请使用外部浏览器打开网页');
                    return;
                }
                // if (this.isPc && !this.isWeixin) {
                if (true) {
                    recOpen();
                    this.loading = true;
                    this.gifImgChange();
                    return;
                }
                let that = this;
                this.$wx.startRecord({
                    success: function (e) {
                        // 开始录音的代码处理
                        that.loading = true;
                        that.gifImgChange();
                        console.log(e, "开始录音");
                    },
                    cancel: function (e) {
                        console.log(e);
                    },
                });
            },
            //播放
            playVioce(index, sign) {
                if (this.audioTwo) {
                    this.audioTwo.pause();
                    this.audioTwoId = '';
                }
                if (sign !== 'vioce') return;
                if (!this.list[index].file) {
                    this.$message.info("过期文件已被丢弃");
                    return;
                }
                if (this.audio == null || this.audio.paused || this.audioId !== this.list[index].id) {
                    if (this.audioId !== this.list[index].id) {
                        if (this.audio) this.audio.pause();
                    }
                    try {
                        this.audio = new Audio();
                        this.audioId = this.list[index].id;
                        this.audio.src = this.list[index].file;
                        this.audio.play();
                        this.audio.addEventListener('ended', () => {
                            this.audioId = '';
                        }, false);
                    } catch (e) {
                        console.log(e, 'dsddsd');
                        this.$message.error('链接已丢失')
                    }
                } else {
                    this.audioId = '';
                    this.audio.pause();
                }
            },
            //回到底部
            setFoot() {
                this.$nextTick(() => {
                    let div = document.getElementById("hBody");
                    div.scrollTop = div.scrollHeight;
                });
            },
            //翻译
            fanyi(blob) {
                let form = new FormData();
                let url = baseUrl + '/WxService/record/upload';
                //将文件转成base24存在本地
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                let readerStr = null;
                reader.onload = function (e) {
                    readerStr = this.result;
                    console.log('base24成功');
                }
                console.log(reader, reader.result, '???');
                form.append("upfile", blob, "recorder.mp3");
                let configs = {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
                this.fanyiLoading = true;
                axios.post(url, form, configs).then(res => {
                    this.fanyiLoading = false;
                    if (this.isRecord) {
                        this.clickSum = 1;
                        //录音长度
                        let length = 0;
                        if (this.vioceTime > 0) length = parseInt(this.vioceTime / 10);
                        if (length == 0) length = 1;
                        this.list.push({
                            sign: "vioce",
                            time: this.getTime(),
                            year: this.getTime('year'),
                            id: (new Date()).getTime(),
                            lengths: length,
                            file: readerStr,
                            msg: res.data.message
                        });
                        this.sendMsg("", res.data.message);
                        // this.sendMsg('', res.data.message, 'other');
                    }
                }).catch((ree) => {
                    this.fanyiLoading = false;
                    this.$message.error('翻译文件失败')
                });

            },

            //停止录音
            stop() {
                this.clickSum = 1;
                if (this.isPc && this.isWeixin) {
                    return;
                }

                if (true) {
                    recStop();
                    if (this.loading) {
                        console.log('上传录音');
                        setTimeout(() => {
                            this.fanyi(audios);
                        }, 100)
                    }
                    this.loading = false;
                    this.loadingChange = false;
                    return;
                }

            }
        },

        created() {
            this.init()
            //判断是否微信
            let ua = navigator.userAgent.toLowerCase();
            let isWeixin = ua.indexOf('micromessenger') !== -1;
            console.log('isweixin', isWeixin);
            this.isWeixin = isWeixin;
            let obj = JSON.parse(localStorage.getItem("aiHistory2"));
            //test
            // list: [
            //   {name: '1'},
            //   {name: '2'},
            //   {name: '3'}
            // ],
            // obj.push({
            //   // sign: "",
            //   qes: true,
            //   up: null,
            //   msg: 'dsd',
            //   year: "21",
            //   time0: "08-03 08:10",
            //   linkId: "1121245"
            // });
            //处理数据，如何不是今年的数据直接删除
            let year = moment((new Date()).getTime()).format('YY');
            for (let i = 0; obj && i < obj.length; i++) {
                if (year !== obj[i].year) {
                    obj.splice(i, 1);
                    i--;
                }
                //一个月清除录音
                if (obj[i] && obj[i].time0) {
                    let time0 = obj[i].time0;
                    let time1 = this.getTime();
                    if (time0[0] !== time1[0] || time0[0] !== time1[1]) {
                        if (obj[i].file) {
                            delete obj[i].file;
                        }
                    }
                }
                //一个小时清除录音
                if (obj[i] && obj[i].time0) {
                    let time = moment(new Date()).format('x') - moment(obj[i].time0).format('x');
                    let date = moment.duration(time, 'milliseconds').hours();
                    let sign = (moment(new Date()).format('MM-DD hh:mm')).split(' ')[0] === obj[i].time0.split(' ')[0];
                    if (!sign || (date >= 1 && obj[i].linkId)) delete obj[i].linkId
                    console.log(sign, date, '时间差');

                }
            }
            console.log('1.1.0.1版本', obj);
            // obj = null;
            //如果没初始化 添加初始化值
            if (obj != null && obj.length > 0) {
                if (obj[0].sign !== 'first')
                    this.list = [{
                        sign: 'first',
                        time0: this.getTime()
                    }];
                this.list = this.list.concat(obj);
                //如果超过十二个小时添加咨询
                let time0 = this.list[this.list.length - 1].time0;
                let time1 = this.getTime();
                if (time0 && time0.length > 0) {
                    let time = moment(time1).format('x') - moment(time0).format('x');
                    let date = moment.duration(time, 'milliseconds').hours();
                    let sign = time0.split(' ')[0] !== time1.split(' ')[0];
                    //二个小时清除列表
                    // if (date >= 2 && this.list.length > 0) {
                    //   for (let i = 0; this.list && i < this.list.length; i++) {
                    //     if (this.list[i].list && this.list[i].list.length > 0) {
                    //       this.list[i].list = [];
                    //     }
                    //   }
                    // }
                    if ((sign && this.list.length > 2) || (date > 11 && this.list.length > 2)) {
                        this.list.push({
                            sign: 'first',
                            time0: this.getTime()
                        });
                    }
                }
            } else {
                this.list = [{
                    sign: 'first'
                }]
            }
            for (let i = 1; i < 9; i++) {
                this.vioceImgList[i - 1] = require("../assets/vioce/" + i + ".png");
            }
            //判断是不是安卓
            const u = navigator.userAgent;
            const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (isiOS) {
                this.isIos = true;
            } else {
                this.isIos = false;
            }
            //判断是不是pc端
            this.isPc = !browserRedirect();
            console.log(this.isPc);
            console.log('isIOS', this.isIos);
            //开启授权录音功能
            recOpen();
            recStop();
        },

        mounted() {
            document.getElementById('zhezhao').style.display="none";
            let tmpid=this
             $(function () {
                $("ul li").hover(function(){
                    $(this).addClass('hs');
                    $(this).prevAll().addClass('hs');
                },function(){
                    $(this).removeClass('hs');
                    $(this).prevAll().removeClass('hs');
                })

                $("ul li").click(function () {
                    $(this).addClass('cs');
                    $(this).prevAll().addClass('cs');
                    $(this).nextAll().removeClass('cs');
                    var child = this;
                    var father = child.parentNode;
                    var i = 0;
                    while((child = child.previousSibling) != null) i++;
                    var j = 1;
                    while((father = father.previousSibling) != null) j++;
                    let body = {"id":-1,"childid":i,"id2":tmpid.realid,"fatherid":j};
                    axios
                        .post(baseUrl,body)
                        .then((res) => {
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                })
            })
            let div = document.getElementById("hBody");
            if (div) {
                div.scrollTop = div.scrollHeight;
            }
            //浏览器刷新或关闭触发
            window.onbeforeunload = (e) => {
                localStorage.setItem("aiHistory2", JSON.stringify(this.list));
                // return "";
            };
            let that = this;
            //苹果端
            window.addEventListener("pagehide", function () {
                localStorage.setItem("aiHistory2", JSON.stringify(that.list));
            }, false);
            this.init()
        },
        

    };
    
</script>
<style lang="scss">
    @import "./aiHome.scss";
</style>
