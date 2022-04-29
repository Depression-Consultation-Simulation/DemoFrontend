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
                        <li  style="color: gray; width: 100%;">依次和机器人对话，完成<b>完整的</b>问诊流程，一般会有明确的结束语比如"我们的问诊就到这里"或"再见"等</li>
                        <li  style="color: gray; width: 100%;">对话完成后，会有弹框提示您按<b>流利程度，使人舒服的程度，参与程度，像人的程度</b>四个指标进行打分</li>
                        <li  style="color: gray; width: 100%;">完成打分后会自动进入和下一个机器人的对话。完成三个机器人的问诊之后，您需要调整相对的分数情况对机器人的性能进行最终排序</li>
                        <li  style="color: gray; width: 100%;">机器人乱序出现，<b style="color: darkred">请记住机器人的编号</b>，最终的分数会按机器人的编号依次展示</li>
                        <li  style="color: gray; width: 100%;">整个过程预计<b>10分钟</b>，感谢您的配合。</li>
                        <div><b>Evaluation Metrics</b></div>
                        <li style="color: gray; width: 100%;">{{metrics[0]}}</li>
                        <li style="color: gray; width: 100%;">{{metrics[1]}}</li>
                        <li style="color: gray; width: 100%;">{{metrics[2]}}</li>
                        <li style="color: gray; width: 100%;">{{metrics[3]}}</li>
                        <div><b>Notes</b></div>
                        <li style="color: gray; width: 100%;">点击右上角的<b>蓝色</b>按钮可以在对话过程中查看四个评价指标的详细解释。</li>
                        <li style="color: gray; width: 100%;">点击<b >灰色</b>按钮会删除对话历史，可以重新开始对话。</li>
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
    import {baseUrl, metrics} from "../util";

    export default {
        name: "IntroView",
        data() {
            return {
                userId: -1,
                metrics: metrics
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