<template>
    <div class="content">
        <Interpretation />
        <Portrait v-bind:userId="userId"/>
        <div class="home-layout" v-loading="fanyiLoading" :class="isIos?'h-ios home-layout':'home-layout'">
            <!-- 用户须知 -->
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
                <el-form ref="form" :model="score_bot1" style="padding-left:8%;padding-right: 8%">
                    <el-form-item>
                        <li >1. {{metrics[0]}}</li>
                        <el-slider
                                v-model="score_bot1.score1"
                                :step="1"
                                :max="5"
                                style="width: 80%;margin-left:5%"
                                show-stops>
                        </el-slider>
                    </el-form-item>
                    <el-form-item >
                        <li> 2. {{metrics[1]}}</li>
                        <el-slider
                                v-model="score_bot1.score2"
                                :step="1"
                                :max = "5"
                                style="width: 80%;margin-left:5%"
                                show-stops>
                        </el-slider>
                    </el-form-item>
                    <el-form-item >
                        <li>3. {{metrics[2]}}</li>
                        <el-slider
                                v-model="score_bot1.score3"
                                :step="1"
                                :max = "5"
                                style="width: 80%;margin-left:5%"
                                show-stops>
                        </el-slider>
                    </el-form-item>
                    <el-form-item >
                        <li>4. {{metrics[3]}}</li>
                        <el-slider
                                v-model="score_bot1.score4"
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
    <!--            <el-button type="primary" @click="onSubmit">提交</el-button>-->
            </el-dialog>
            <div class="h-body" id="hBody">
                <div @click="clearData" class="delete-talk">
                    <i class="el-icon-delete"></i>
                </div>
                <div @click="centerDialogVisible = true" class="delete-talk2">
                    <i class="el-icon-question"></i>
                </div>
                <div @click="openScoreWindow" class="delete-talk3">
                    <i class="el-icon-score">&#9733;</i>
                </div>
                <!-- 对话 -->
                <div
                        :class="item.sign === 'vioce' || item.sign === 'msg' ? 'right-msg' : ''"
                        v-for="(item, index) of list"
                        :key="index + 'ds'"
                >
                    <div v-if="item.time" class="time">
                        {{ item.time }}
                    </div>


                    <!-- bot -->
                    <img v-if="(item.sign == null || item.sign === 'first') && item.items == null" :src="img.left" class="userImg"/>
                    <!-- 导语 -->
                    <div class="txt1" v-if="item.sign === 'first'">
                        <div>
                            hi～我是心理健康助手小驰<b style="color: #9abdf9">一号</b>，可以对我说"开始吧"进入抑郁症问诊流程
                        </div>
                    </div>
                    <div
                            @click="playVioce(index, item.sign)"
                            v-if="item.sign !== 'first'"
                            :class="item.sign == null ? item.imageUrl!=null?'emoji':item.items != null?'report':'txt1' : 'txt'"
                    >
                        <!-- sign为空表示智能回答，voice为语音咨询，msg为文字咨询 -->
                        <div style="display: flex; text-align: right" v-if="item && item.sign == 'vioce'">
    <!--                        <div style="margin-left: 10px">{{ item.lengths }}"</div>-->
    <!--                        <img class="playImg"-->
    <!--                             :src="audioId !== item.id?require('../assets/msgLInk1.png'):require('../assets/msgLInk0.png')">-->
                        </div>

                        <span style="position: relative" v-else-if="item.sign === 'msg' || item.qes === true">
<!--                            <span>{{ item.msg }}</span>-->
                            <span v-if="item.msg.indexOf('选项来回答我')===-1">{{ item.msg }}</span>
                            <span v-else>小驰没有听懂哦，可以参考选项来回答我</span>
<!--                            <span>{{item.msg}}</span>-->
                            <br v-if="item.link && item.msg"/>
    <!--                        <span @click.stop="playOtherUrl(item)" v-if="item.linkId && item.msg" class="otherSpan">-->
    <!--                            <img class="play-icon1"-->
    <!--                                 :src="audioTwoId !== item.linkId ? require('../assets/block2.png'):require('../assets/black1.png')">-->
    <!--                            <img class="play-icon" :src="require('../assets/block3.png')">-->
                                <!--            <i @click="playOtherUrl(item)" v-if="item.linkId && item.msg" class="el-icon-video-play play-icon"></i>-->
    <!--                        </span>-->

                            <!-- 图片 -->
                            <img v-if="item.imageUrl" :src="item.imageUrl" style="width: 8rem"/>
                            <!-- 报告 -->
                            <report v-if="item.items" v-bind:items="item.items" v-bind:description="item.description"/>
                            <!-- 选择 -->
                            <div v-if="item.sign == null && item.selections&&index === list.length-1&&(item.msg.indexOf('持续了多久')!==-1||item.msg.indexOf('经历以下事件')!==-1||item.msg.indexOf('选项来回答我')!==-1)"
                                 style="padding: 5px 10px;margin-top: 5px">
    <!--                            <div style="font-size: small;color: #6c6c6c">既可以点选也可以直接用语音或者文字的方式输入哦</div>-->
                                <el-checkbox-group v-model="selectedList">
                                    <el-col>
                                        <el-col :xs="12">
                                            <el-checkbox v-for="item in item.selections" :label="item.content" :key="item.content"
                                                         style="margin-top: 10px;">{{item.content}}</el-checkbox>
                                        </el-col>
                                    </el-col>
                                </el-checkbox-group>
                                <el-row v-if="item.selections"
                                        style="margin-top: 30px;display:flex;justify-content: flex-end;align-items: center;width: 100%;">
                                    <el-col :span="6">
                                        <el-button type="primary" style="height: 60%;background-color: #81acf8;margin-top: 10px"
                                                   @click="sumbitCheckbox" size="small">确定</el-button>
                                    </el-col>
                                </el-row>
                            </div>

                        </span>
                    </div>

                    <!-- user -->
                    <img v-if="item.sign != null && item.sign !== 'first'" :src="img.right" class="userImg"/>

<!--                    <div-->
<!--                            v-if="item.sign == 'vioce' && item.msg && item.msg.length > 0"-->
<!--                            class="fanyi"-->
<!--                    >-->
<!--                        <div>{{ item.msg }}</div>-->
<!--                    </div>-->
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
    <!--                           @touchstart.native="enter" @touchend.native="leave"><strong>{{ loading ? "松开 发送" : "按住 说话" }}</strong></el-button>-->
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
    import {baseUrl, serverUrl, browserRedirect, metrics, examples} from "../util/index";
    import axios from "axios";
    import moment from "moment";
    import {recOpen, recStop, audios} from './recorder';
    import Report from "./Report";
    import Portrait from "./Portrait";
    import Interpretation from "./Interpretation";

    export default {
        components: {Interpretation, Portrait, Report},
        data() {
            return {
                //jiaxuan add start
                audioarr:[],
                nownum:0,
                //jiaxuan add end
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
                scoreDialogVisible: false,
                score_bot1: {
                    score1: 0,
                    score2: 0,
                    score3: 0,
                    score4: 0
                },
                context: [],
                metrics: metrics,
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
            //     let url = serverUrl + "/WxService/DataExchange?query=";
            //     url += this.msg;
            //     axios
            //         .get(url)
            //         .then((res) => {
            //             if (this.msg && this.msg.length > 0) {
            //                 this.mindView = true;
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
                console.log(this.score_bot1);
                console.log(this.context.length);
                let url = baseUrl + "/saveScores";
                axios
                    .post(url,{
                        userId: this.$route.query.userId,
                        botId: 1,
                        score: JSON.stringify(this.score_bot1),
                        history: JSON.stringify({"history": this.context})
                    })
                    .then((res) => {
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        // next = this.$route.query.userId%3+1
                        let target = this.$route.query.userId%3 === 1?"/result":"/bot2";
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
            contiousplay(audiosrc){
                if(this.nownum==0)this.$refs.audio.addEventListener('ended', () => {
                    //console.log('!');
                    if(this.$refs.audio.currentTime==0)return;
                    //this.$refs.audio.removeEventListener('ended', this.AudioEnd(), false);
                    //console.log('!');
                    this.$refs.audio.currentTime = 0;
                    this.contiousplay('');
                }, false);
                if(audiosrc!='')this.audioarr.push(audiosrc);
                console.log(this.nownum);
                console.log(this.audioarr.length);
                //if(this.nownum>this.audioarr.length){
                //this.nownum=0;
                //this.audioarr.length=0;
                //return 0;
                //}
                //console.log(0);
                //console.log(this.$refs.audio.currentTime);
                if(this.$refs.audio.currentTime==0){
                    if(this.nownum>=this.audioarr.length)return 0;
                    this.$refs.audio.src = this.audioarr[this.nownum];
                    this.$refs.audio.currentTime = 0.01;
                    this.$refs.audio.play();
                    //this.$refs.audio.addEventListener('ended',this.AudioEnd(), false);
                }
                else{
                    this.nownum--;
                    //this.$refs.audio.addEventListener('ended', this.AudioEnd(), false);
                }
                this.nownum++;
            },

            playOtherUrl(list) {
                if (this.audio) {
                    this.audio.pause();
                    this.audioId = '';
                }
                if (list.linkId == null || !list.linkId) return;
                //获取link
                let url2 = baseUrl + '/WxService/DataExchange/getTtsUrl?id=' + list.linkId + '&text=' + list.msg;
                if (this.audioTwo == null || this.audioTwo.paused || this.audioTwoId !== list.linkId) {
                    if (this.audioTwoId !== list.linkId) {
                        if (this.audioTwo) this.audioTwo.pause();
                    }
                    // this.audioTwoId = null;
                    axios.get(url2).then((res) => {
                        let link = res.data.result;
                        try {
                            //处理多次播放问题
                            if (this.audioTwo) this.audioTwo.pause();
                            this.audioTwo = new Audio();
                            console.log(this.audioTwoId, list.linkId)
                            this.audioTwoId = list.linkId;
                            this.audioTwo.src = link;
                            this.audioTwo.play();
                            // this.firstPlay = list.linkId;
                            this.audioTwo.addEventListener('ended', () => {
                                this.audioTwoId = '';
                            }, false);
                        } catch (e) {
                            console.log(e, 'dsddsd');
                            this.$message.error('链接已丢失')
                        }
                    }).catch(e => {
                        console.log(e);
                    });
                } else {
                    this.audioTwoId = '';
                    this.audioTwo.pause();
                }
            },

            changeTab() {
                this.keyState = !this.keyState;
                this.loading = false;
            },

            openUrl(url) {
                window.open(url)
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
                    localStorage.removeItem('aiHistory1');
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
            //点击问题模块
            answerRes(index) {
                this.clickSum = index + 2;
                if (this.loadingOther) return;
                if (index === 5) {
                    // let url1 = baseUrl + "/WxService/record?query=hhh&sort=" + this.clickSum;
                    this.loadingOther = true;
                    // axios.get(url1).then((res) => {
                    //   console.log(res, 7);
                    // }).catch(() => {
                    // })
                    let url = "https://www.wjx.cn/m/100773984.aspx";
                    window.open(url);
                    return;
                }
                let name = "";
                name = this.serveList[index].name;
                // if (index === 4) {
                //   name = "住院探望时间";
                // }
                this.answerDetailRes(name, undefined, "big");
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
                    this.pushHistory("patient",name)
                }
                this.getRes(name, index, sign);
                this.setFoot();
            },
            //联想点击
            mindSend(data) {
                this.clickSum = 0;
                this.mindView = false;
                this.msg = "";
                let index = this.getArrIndex(data);
                this.answerDetailRes(data, index, 'txt');
            },
            //点赞
            comments(sign, index) {
                this.list[index].up = sign;
            },
            pushHistory(from, content){
                let history = {};
                history.from = from;
                history.content = content;
                this.context.push(history)

            },
            //后端获取详细内容
            getRes(msg, index, sign) {
                let url = serverUrl + "/WxService/record?query=" + msg + "&sort=" + this.clickSum + '&sessionId=' + this.sessionId;
                this.loadingOther = true;

                axios
                    .get(url,
                        {
                            headers: {
                                token: "null",
                            },
                        })
                    .then((res) => {
                        console.log("")
                        this.loadingOther = false;
                        if (res) {
                            let obj = {};
                            console.log(res);
                            this.sessionId = res.data.sessionId;
                            // console.log(this.sessionId);
                            obj.lodMsg = msg;
                            obj.list = [];
                            if (
                                res.data.dm &&
                                res.data.dm.inspire &&
                                res.data.dm.inspire.length > 0
                            ) {
                                res.data.dm.inspire.forEach((e) => {
                                    if (e.widget && e.widget.text && e.widget.text.length > 0) {
                                        obj.list.push({
                                            name: e.widget.text,
                                        });
                                    }
                                });
                            }
                            // if (sign !== "big")
                            let report = {};
                            if (res.data.dm.widget != null) {
                                if (res.data.dm.widget.type === "custom") {
                                    if (res.data.dm.widget.symptoms)
                                        obj.selections = res.data.dm.widget.symptoms
                                    else {
                                        report.items = res.data.dm.widget.items;
                                        report.description = res.data.dm.widget.description;
                                        // report.items = [{"content": "3"}, {"content": "2"}, {"content": "1"}, {"content": "4"}, {"content": "1"}, {"content": "2"}, {"content": "3"}, {"content": "5"}, {"content": "0"}, {"content": "0"}, {"content": "0"}, {"content": "0"}, {"content": "1"}, {"content": "0"}];
                                        // report.description =  [{"content": "持续的情绪低落，且有晨重夜轻特点"}, {"content": "兴趣低下，对所有事情兴趣丧失"}, {"content": "决断困难"}, {"content": "缺乏自信心，自我价值感低，有自罪感，无望感"}, {"content": "入睡困难，睡眠时间短，多噩梦"}, {"content": "暴饮暴食"}, {"content": "精神运动性激越和迟滞"}, {"content": "个人生活功能受损，人际关系不稳定"}, {"content": "有自残自伤想法"}];
                                        report.qes = true;
                                        report.year = this.getTime('year');
                                        report.time0 = this.getTime();
                                        console.log("1")
                                    }

                                } else if (res.data.dm.widget.type === "package") {
                                    for (let i = 0; i < res.data.dm.widget.list.length; i++) {
                                        if (res.data.dm.widget.list[i].type === "selection") {
                                            obj.selections = res.data.dm.widget.list[i].symptoms;
                                        } else {
                                            // let image = {};
                                            // image.imageUrl = res.data.dm.widget.list[i].url;
                                            // console.log(image);
                                            // image.qes = true;
                                            // image.oldIndex = index;
                                            // image.year = this.getTime('year');
                                            // image.time0 = this.getTime(); //咨询返回不需要添加时间
                                            //
                                            // this.list.push(image);
                                        }
                                    }
                                }
                            }

                            // 播报语音
                            // if (res.data.dm.nlg!=null) {
                            //     //jiaxuan-add-start
                            //     this.contiousplay(res.data.speakUrl);
                            //     //jiaxuan-add-end
                            // }else if(res.data.dm.speak!=null){
                            //     res.data.dm.speak.list.forEach((e) => {
                            //         //jiaxuan-add-start
                            //         this.contiousplay(e.speakUrl);
                            //         //jiaxuan-add-end
                            //     });
                            // }
                            //数据写入
                            obj.oldIndex = index;
                            obj.qes = true;
                            obj.up = null;
                            obj.year = this.getTime('year');
                            obj.time0 = this.getTime(); //咨询返回不需要添加时间
                            obj.link = res.data.speakUrl;
                            //链接拆分
                            obj.linkId = new Date().getTime();

                            if (res.data.dm.nlg) {
                                obj.msg = res.data.dm.nlg;
                                console.log(obj);
                                this.pushHistory("doctor",obj.msg);
                                this.list.push(obj);
                                this.setFoot();
                                // if (report.items) this.list.push(report);
                                console.log("push");
                            } else if (res.data.dm.speak) {
                                if (report.items) {
                                    let obj1 = Object.assign({}, obj);
                                    obj1.msg = res.data.dm.speak.list[0].text;
                                    obj1.link = res.data.dm.speak.list[0].speakUrl;
                                    console.log(obj1);
                                    this.pushHistory("doctor",obj1.msg);
                                    this.list.push(obj1);
                                    // this.list.push(report);
                                    let obj2 = Object.assign({}, obj);
                                    obj2.msg = res.data.dm.speak.list[1].text;
                                    obj2.link = res.data.dm.speak.list[1].speakUrl;
                                    console.log(obj2);
                                    this.list.push(obj2);
                                    this.pushHistory("doctor",obj2.msg);
                                    this.setFoot();
                                    this.scoreDialogVisible = true;
                                } else {
                                    res.data.dm.speak.list.forEach((e) => {
                                        let obj1 = Object.assign({}, obj);
                                        obj1.msg = e.text;
                                        obj1.link = e.speakUrl;
                                        console.log(obj1);
                                        this.list.push(obj1);
                                        this.pushHistory("doctor",obj1.msg);
                                        this.setFoot();
                                    });
                                }

                            }
                            if(res.data.speakUrl) this.urlToBlob(res.data.speakUrl, this.list.length)
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
            changeSort(index, name, data) {
                let url =
                    baseUrl + "/WxService/DataExchange/getAllQuestion?query=" + name;
                axios
                    .get(url)
                    .then((res) => {
                        if (res.data && res.data.result && res.data.result.length > 0) {
                            let list = res.data.result;
                            for (let i = 0; i < data.length; i++) {
                                for (let j = 0; j < list.length; j++) {
                                    if (list[j].question === data[i].name) {
                                        list.splice(j, 1);
                                        j = j - 1;
                                    }
                                }
                            }
                            if (list.length >= 3) {
                                let sum = [];
                                sum[0] = Math.floor(Math.random() * list.length);
                                let p = true;
                                setTimeout(() => {
                                    p = false;
                                }, 6000);
                                while (p) {
                                    sum[1] = Math.floor(Math.random() * list.length);
                                    sum[2] = Math.floor(Math.random() * list.length);
                                    if (sum[1] !== sum[0] && sum[2] !== sum[0] && sum[2] !== sum[1])
                                        break;
                                }
                                console.log(data, list, sum);
                                this.list[index].list = [];
                                sum.forEach((e) => {
                                    this.list[index].list.push({
                                        name: list[e].question,
                                    });
                                });
                                this.$forceUpdate();
                                console.log(this.list[index]);
                            } else {
                                this.$message.warning("暂无更多");
                            }
                        } else {
                            this.$message.warning("暂无数据");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            //gif
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
            //取消录音
            cancelVioce() {
                console.log("取消录音");
                this.isRecord = false;
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

            urlToBlob(url, index) {
                axios.get(url, {
                    responseType: "blob", // 1.首先设置responseType对象格式为 blob: // 二进制流
                }).then(
                    (res) => {
                        let blob = new Blob([res.data], {
                            type: "audio/mp3",
                        });
                        let reader = new FileReader();
                        reader.readAsDataURL(blob);
                        let readerStr = null;
                        reader.onload = function (e) {
                            readerStr = this.result;
                            this.list[index].link = readerStr;
                            console.log(readerStr.length, 'base24成功', readerStr);
                        }
                    }
                ).catch((error) => {
                    console.log(error)
                });
            },
            //停止录音
            stop() {
                this.clickSum = 1;
                if (this.isPc && this.isWeixin) {
                    return;
                }
                //pc端录音和微信端录音为二个方案
                // if (this.isPc && !this.isWeixin) {

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
                // let that = this;
                // this.$wx.stopRecord({
                //   success: function (e) {
                //     that.loading = false;
                //     let length = 0;
                //     if (that.vioceTime > 0) length = parseInt(that.vioceTime / 10);
                //     if (length === 0) length++;
                //     if (!that.loadingChange) {
                //       // 上传语音
                //       that.$wx.uploadVoice({
                //         localId: e.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                //         success: function (res) {
                //           //下载语音id//上传翻译
                //           let token = localStorage.getItem('access_token');
                //           let url2 = "https://file.api.weixin.qq.com/cgi-bin/media/get?access_token=" + token + "&media_id=" + res.serverId;
                //           let url = baseUrl + "/WxService/record/upload/amr";
                //           // that.urlToBlob(url);
                //           console.log(res, url, '语音服务器');
                //           this.loadingOther = true;
                //           axios.post(url, {query: url2}).then((res) => {
                //             if (res) {
                //               if (that.isRecord) {
                //                 that.list.push({
                //                   sign: "vioce",
                //                   id: e.localId,
                //                   time: that.getTime(),
                //                   year: that.getTime('year'),
                //                   lengths: length,
                //                   msg: res.data.message
                //                 });
                //                 that.sendMsg("", res.data.message);
                //               }
                //             }
                //           }).catch((err) => {
                //             console.log(err);
                //           });
                //         }
                //       });
                //     } else {
                //       that.loadingChange = false;
                //     }
                //     that.isRecord = true;
                //     console.log(e, e.localId, "结束录音");
                //   },
                //   cancel: function (e) {
                //     that.loadingChange = false;
                //     console.log(e);
                //   },
                // });
            }
        },

        created() {
            //判断是否微信
            let ua = navigator.userAgent.toLowerCase();
            let isWeixin = ua.indexOf('micromessenger') !== -1;
            console.log('isweixin', isWeixin);
            this.isWeixin = isWeixin;
            let obj = JSON.parse(localStorage.getItem("aiHistory1"));
            this.init();
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
            let div = document.getElementById("hBody");
            if (div) {
                div.scrollTop = div.scrollHeight;
            }
            //浏览器刷新或关闭触发
            window.onbeforeunload = (e) => {
                localStorage.setItem("aiHistory1", JSON.stringify(this.list));
                // return "";
            };
            let that = this;
            //苹果端
            window.addEventListener("pagehide", function () {
                localStorage.setItem("aiHistory1", JSON.stringify(that.list));
            }, false);
            this.init()
        },

    };
</script>

<style lang="scss">
    @import "./aiHome.scss";
</style>
