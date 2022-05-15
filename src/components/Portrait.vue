<template>
    <el-card class="portrait-main" shadow="hover">
        <div slot="header" class="clearfix">
            <i class="el-icon-s-custom" style="font-size: larger"></i>
            <span style="font-size: larger;font-weight: bold">病人画像 (Patient Portrait)</span>
        </div>
        <div class="portrait-content">
<!--            <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">-->
                <el-row >
                    <el-col :span=24 class="tip">请您尝试扮演以下病人，用自然的语言和医生交流您的情况</el-col>
                </el-row>
                <el-descriptions title="" column="2" border size="mini;" labelStyle="word-break:keep-all;width:80px" contentStyle="max-height:20px">
                    <el-descriptions-item label="年龄">{{portrait.age}}</el-descriptions-item>
                    <el-descriptions-item label="性别" v-if="portrait.sex==='0'"class="basic_item">男</el-descriptions-item>
                    <el-descriptions-item label="性别" v-else-if="portrait.sex==='1'" class="basic_item">女</el-descriptions-item>
                    <el-descriptions-item label="婚姻状况">{{portrait.marriage}}</el-descriptions-item>
                    <el-descriptions-item label="职业"><el-tag>{{portrait.profession}}</el-tag></el-descriptions-item>
                    <el-descriptions-item label="情绪低落原因" span="2" v-if="portrait.reason!==''">{{portrait.reason}}</el-descriptions-item>
                    <el-descriptions-item label="具体症状" span="2">
<!--                        <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto;height: 100px">-->
                            <div v-for="(item,i) in portrait.description">
                                <p v-if="item.content!=''">{{i}}. {{item.content}}</p>
                            </div>
<!--                        </ul>-->
                    </el-descriptions-item>
                    <el-descriptions-item label="相关疾病" span="2" v-if="relate_disease.length!==0">
                        <div v-for="(item,i) in relate_disease" >
                            <p class="sub_item" v-if="item!=''">{{i}}. {{item}}</p>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="相关疾病" span="2" v-else>
                        无
                    </el-descriptions-item>
                </el-descriptions>
        </div>
    </el-card>


</template>

<script>
    import {baseUrl} from "../util";
    import axios from "axios";

    export default {
        name: "Portrait",
        info: "暂无信息",
        props: {
            userId: Number
        },
        data(){

            return {
                portrait: '',
                relate_disease:[],
            }
        },
        created() {
            // this.init()
        },
        mounted:async function(){
            this.init()

        },
        methods:{
            beforeUpdate :function(){
            },
            init(){
                let url = baseUrl + "/getPortrait?userId="+this.userId;
                axios
                    .get(url)
                    .then((res) => {
                        this.portrait = JSON.parse(res.data.content);
                        this.$set({
                            portrait: res.data.content
                        });
                        console.log(this.portrait);
                        let items = this.portrait.items;
                        if (parseInt(items[9].content)>0){
                            this.relate_disease.push("可能有甲状腺疾病，脑肿瘤等疾病")
                        }
                        if(parseInt(items[10].content)>0){
                            this.relate_disease.push("亲人去世之后超过6个月深陷悲伤")
                        }
                        if(parseInt(items[11].content)>0){
                            this.relate_disease.push("长期服用咖啡因、酒精等精神活性物质")
                        }
                        if(parseInt(items[12].content)>0){
                            this.relate_disease.push("有时会感到焦躁不安，说话比平时显著增多")
                        }
                        if(parseInt(items[13].content)>0){
                            this.relate_disease.push("每个月经周期都会有相类似的症状")
                        }
                        console.log(items);
                        console.log(this.relate_disease)
                    })
                    .catch((err) => {
                        console.log(err);
                    });


            }
        },
    }
</script>

<style scoped>
    .portrait-main {
        background-color: white;
        width: 100%;
        height: 100%;
        /*border: 1px lightgray solid;*/
        /*overflow: hidden;*/
    }

    .portrait-header {
        border-bottom: 1px lightgray solid;
        height: 3rem;
        padding-top: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .portrait-content {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 1rem 1rem;
    }
    .basic_item {
        /*padding-bottom: 1rem;*/
        /*font-size: 16px;*/
    }
    .tip {
        padding-bottom: 2rem;
        font-size: 14px;
        color: grey;
        /*font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;*/
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
</style>