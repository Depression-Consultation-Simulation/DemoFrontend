
<template>
        <el-container>
            <el-main>
                <el-card
                        title="Tips"
                        tag="article"
                        style="width: 50rem"
                >
                    <el-header>评测结果</el-header>
                    <div style="margin-top: 10px">
<!--                        Please carefully read these tips before starting your task, thank you.<br>-->
                        请您调整三个机器人的分数，使同一指标三个机器人的分数<b style="color: darkred">均不相等</b>，以反映机器人之间对比的情况
                    </div>
                    <div class="card-body">
                        <el-form ref="form" :model="scores" style="padding-left:8%;padding-right: 8%">
                            <el-form-item>
                                <li >1. {{metrics[0]}}</li>
                                <div style="display: flex;flex-direction: row;">
                                    <div>机器人1：</div>
                                    <el-slider
                                            label="机器人1"
                                            v-model="scores.score1.score1"
                                            :step="1"
                                            :max="5"
                                            style="width: 80%;margin-left:10px"
                                            show-stops>
                                    </el-slider>
                                </div>
                                <div style="display: flex;flex-direction: row;">
                                    <div>机器人2：</div>
                                    <el-slider
                                            v-model="scores.score2.score1"
                                            :step="1"
                                            :max="5"
                                            style="width: 80%;margin-left:10px"
                                            show-stops>
                                    </el-slider>
                                </div>
                                <div style="display: flex;flex-direction: row;">
                                    <div>机器人3：</div>
                                    <el-slider
                                            v-model="scores.score3.score1"
                                            :step="1"
                                            :max="5"
                                            style="width: 80%;margin-left:10px"
                                            show-stops>
                                    </el-slider>
                                </div>
                            </el-form-item>
                            <el-form-item >
                                <li> 2. {{metrics[1]}}</li>
                                <div style="display: flex;flex-direction: row;">
                                    <div>机器人1：</div>
                                    <el-slider
                                            v-model="scores.score1.score2"
                                            :step="1"
                                            :max="5"
                                            style="width: 80%;margin-left:10px"
                                            show-stops>
                                    </el-slider>
                                </div>
                                <div style="display: flex;flex-direction: row;">
                                    <div>机器人2：</div>
                                    <el-slider
                                            v-model="scores.score2.score2"
                                            :step="1"
                                            :max="5"
                                            style="width: 80%;margin-left:10px"
                                            show-stops>
                                    </el-slider>
                                </div>
                                <div style="display: flex;flex-direction: row;">
                                    <div>机器人3：</div>
                                    <el-slider
                                            v-model="scores.score3.score2"
                                            :step="1"
                                            :max="5"
                                            style="width: 80%;margin-left:10px"
                                            show-stops>
                                    </el-slider>
                                </div>
                            </el-form-item>
                            <el-form-item >
                                <li>3. {{metrics[2]}}</li>
                                <div style="display: flex;flex-direction: row;">
                                    <div>机器人1：</div>
                                    <el-slider
                                            v-model="scores.score1.score3"
                                            :step="1"
                                            :max="5"
                                            style="width: 80%;margin-left:10px"
                                            show-stops>
                                    </el-slider>
                                </div>
                                <div style="display: flex;flex-direction: row;">
                                    <div>机器人2：</div>
                                    <el-slider
                                            v-model="scores.score2.score3"
                                            :step="1"
                                            :max="5"
                                            style="width: 80%;margin-left:10px"
                                            show-stops>
                                    </el-slider>
                                </div>
                                <div style="display: flex;flex-direction: row;">
                                    <div>机器人3：</div>
                                    <el-slider
                                            v-model="scores.score3.score3"
                                            :step="1"
                                            :max="5"
                                            style="width: 80%;margin-left:10px"
                                            show-stops>
                                    </el-slider>
                                </div>
                            </el-form-item>
                            <el-form-item >
                                <li>4. {{metrics[3]}}</li>
                                <div style="display: flex;flex-direction: row;">
                                    <div>机器人1：</div>
                                    <el-slider
                                            v-model="scores.score1.score4"
                                            :step="1"
                                            :max="5"
                                            style="width: 80%;margin-left:10px"
                                            show-stops>
                                    </el-slider>
                                </div>
                                <div style="display: flex;flex-direction: row;">
                                    <div>机器人2：</div>
                                    <el-slider
                                            v-model="scores.score2.score4"
                                            :step="1"
                                            :max="5"
                                            style="width: 80%;margin-left:10px"
                                            show-stops>
                                    </el-slider>
                                </div>
                                <div style="display: flex;flex-direction: row;">
                                    <div>机器人3：</div>
                                    <el-slider
                                            v-model="scores.score3.score4"
                                            :step="1"
                                            :max="5"
                                            style="width: 80%;margin-left:10px"
                                            show-stops>
                                    </el-slider>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-button style="margin: 15px;" @click="onSubmit">提 交</el-button>

                </el-card>
            </el-main>
        </el-container>
    </template>

    <script>
        import axios from "axios";
        import {baseUrl, metrics} from "../util";

        export default {
            name: "Result",
            data() {
                return {
                    scores: {},
                    metrics: metrics
                };
            },
            created () {
                // 初始化
                this.init()
            },
            mounted() {

            },
            methods: {
                async init(){
                    this.$router.onReady(() => {
                        console.log(this.$route.query.userId);
                        let userId = this.$route.query.userId
                        axios
                            .post(baseUrl+"/getScores",{
                                userId: userId
                            })
                            .then((res) => {
                                this.scores = res.data;
                                this.scores.score1 = JSON.parse(this.scores.score1);
                                this.scores.score2 = JSON.parse(this.scores.score2);
                                this.scores.score3 = JSON.parse(this.scores.score3);
                                console.log(this.scores)
                                // this.$router.push({ path: '/bot1', query: {"userId": this.userId }});
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    });
                },
                onSubmit() {
                    for(let i=1;i<=4;i++){
                        let x1 = eval("this.scores.score1.score"+i);
                        let x2 = eval("this.scores.score2.score"+i);
                        let x3 = eval("this.scores.score3.score"+i);
                        if (x1===x2||x1===x3||x2===x3){
                            this.$message({
                                message: '指标'+ i +"有重复分数",
                                type: 'warning'
                            });
                            return;
                        }
                    }
                    axios
                        .post(baseUrl+"/saveScores",{
                            userId: this.$route.query.userId,
                            botId: 4,
                            bot1: JSON.stringify(this.scores.score1),
                            bot2: JSON.stringify(this.scores.score2),
                            bot3: JSON.stringify(this.scores.score3),
                        })
                        .then((res) => {
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$router.push('/thank')
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
        }
        br{
            display:inline;
            line-height:11px;
        }
    </style>