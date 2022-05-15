<template>
    <el-container>
        <el-main>
            <el-card
                    title="Tips"
                    tag="article"
                    style="width: 50rem"
            >
                <el-header>抑郁症问诊对话系统人工评测</el-header>
                <div>
                    Please carefully read these tips before starting your task, thank you.<br>
                    当您开始评测之前，请先认真阅读此页
                </div>
                <div class="card-body">
                    <div><b>Our Purpose</b></div>
                    <div>
                        <li style="color: gray;width: 100%;">我们构建了三个抑郁症问诊对话机器人, 希望从四个人工评价指标对比这三个机器人的用户体验</li>
                    </div>
                    <div style="width: 100%">
                        <div><b>Your Task</b></div>
                        <li  style="color: gray; width: 100%;"><b style="color: darkred">以抑郁症问诊为目的</b>，用<b>口语化</b>的说法<b>主动</b>和三个机器人<b>聊天</b>，我们期待您<b>主动倾诉，对话由您来引导，围绕您的情况展开</b></li>
                        <li  style="color: gray; width: 100%;">完成<b>完整的</b>问诊流程，一般问诊会有明确的结束语比如"我们的问诊就到这里"或"再见"等</li>
                        <li  style="color: gray; width: 100%;">为了您更好地体验机器人功能，我们为您提供了<b>病人画像</b>及<b>症状解释</b>，您可以参考画像<b>主动</b>和机器人聊天，在对话过程中您需要尽量想象画像人物的生活事件及事件中的心理状态，与机器人<b>倾诉</b></li>
                        <li  style="color: gray; width: 100%;">对话完成后，会有弹框提示您按<b>流利程度，使人舒服的程度，像医生的程度，参与程度</b>四个指标进行打分</li>
                        <li  style="color: gray; width: 100%;">完成打分后会自动进入和下一个机器人的对话。完成三个机器人的问诊之后，您需要调整相对的分数情况对机器人的性能进行最终排序</li>
                        <li  style="color: gray; width: 100%;">机器人乱序出现，<b style="color: darkred">请记住机器人的编号</b>，最终的分数会按机器人的编号依次展示</li>
                        <li  style="color: gray; width: 100%;">整个过程预计<b>8-15分钟</b>左右，感谢您的配合。</li>
                        <div><b>Evaluation Metrics</b></div>
                        <div style="color: darkred">请注意四个指标是需要分开评测的，不要按最终的印象统一给出，在最终的对比评分界面，您可以通过在浏览器中输入url回看对话历史</div>
                        <div v-for="(metric,index) in metrics">
                            <li style="color: gray; width: 100%;">{{metric}}</li>
                            <div v-if="examples[index]" style="background-color: #deebed;padding: 10px;color: gray;margin: 10px">
                                <div><i class="el-icon-success" style="color:#67C23A; "></i> 正例</div>
                                <div style="white-space: pre-line;">{{examples[index]["right"]}}</div>
                                <div><i class="el-icon-error" style="color: #E6A23C "></i> 反例</div>
                                <div style="white-space: pre-line">{{examples[index]["wrong"]}}</div>
                            </div>
                        </div>
                        <div><b>Notes</b></div>
                        <li style="color: gray; width: 100%;">点击右上角的<b>蓝色</b>按钮可以在对话过程中查看评测指标的解释</li>
                        <li style="color: gray; width: 100%;">点击<b >灰色</b>按钮会删除对话历史，可以重新开始对话。<b>在开始新的对话之前，请删除页面上旧的对话历史</b>。</li>
                        <li style="color: gray; width: 100%;">如果遇到您觉得对话结束，但是没有出现评分弹窗的情况，您可以点击右上方<b>绿色</b>按钮进行评分。</li>
                    </div>
                </div>
                <el-button style="margin: 15px" @click="login">我已知晓，开始评测</el-button>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
    import axios from "axios";
    import {baseUrl, metrics, examples} from "../util";

    export default {
        name: "IntroView",
        data() {
            return {
                userId: -1,
                metrics: metrics,
                examples: examples
            };
        },
        methods: {
            login() {
                axios
                    .get(baseUrl+"/login")
                    .then((res) => {
                        this.userId=res.data.userId;

                        console.log(this.userId);
                        let target = "/bot" + (this.userId%3+1);
                        localStorage.setItem("portrait", JSON.parse(res.data.content));
                        this.$router.push({ path: target, query: {"userId": this.userId }});
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            },
        }
    }
</script>

<style scoped>
    .el-header, .el-footer {
        background-color: #deebed;
        color: #333;
        text-align: center;
        line-height: 60px;
        font-size: larger;
        font-weight: bolder;
        border: thin #9abdf9;
        border-radius: 4px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        /*min-height: 20rem;*/
        line-height: 38px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .card-body{
        text-align: left;
        /*width: 50rem;*/
        padding: 0.5rem;
        /*height: auto;*/
    }
    br{
        display:inline;
        line-height:11px;
    }
</style>