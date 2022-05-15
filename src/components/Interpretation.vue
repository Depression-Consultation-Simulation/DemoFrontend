<template>
    <el-card class="portrait-main" shadow="hover">
        <div slot="header" class="clearfix">
            <i class="el-icon-menu" style="font-size: larger"></i>
            <span style="font-size: larger;font-weight: bold">症状解释 (Symptom Interpretation)</span>
        </div>
        <div class="portrait-content">
<!--            <ul class="infinite-list" v-infinite-scroll="load" style="padding-right: 2rem">-->
                <el-row >
                    <el-col :span=24 class="tip">以下症状均为<b>过去两周持续的状态</b>，可以根据自己的理解进行自由的表达，滑动查看全部症状</el-col>
                </el-row>
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%;font-size: small"
                        stripe
                        max-height="600"
                >
                    <el-table-column
                            prop="sym"
                            label="症状"
                            width="100"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="inter"
                            label="解释"

                    >
<!--                            show-overflow-tooltip-->

                    </el-table-column>
                </el-table>
<!--            </ul>-->
        </div>
    </el-card>


</template>

<script>
    export default {
        data() {
            return {
                tableData: [{
                    sym: '持续的情绪低落',
                    inter: '连续两周以上几乎每天或者大部分时间都心情不好',
                }, {
                    sym: '晨重夜轻',
                    inter: '早上或者晚上的时候觉得更难过',
                }, {
                    sym: '对过去的爱好兴趣丧失',
                    inter: '以前很喜欢某事，现在不喜欢了，觉得没意思',
                }, {
                    sym: '对所有事情兴趣丧失',
                    inter: '所有事情都觉得没有意思',
                },{
                    sym: '缺乏情感体验',
                    inter: '没有快乐的感觉，同时也没有了悲伤和愤怒的感觉',
                },{
                    sym: '疲倦',
                    inter: '没做什么事情就觉得很累，不想上班/上学只想躺在床上',
                },{
                    sym: '决断困难',
                    inter: '在思考问题时会感觉反应不过来、无法思考、脑中一片空白，或在做本不需要思考的事情时犹豫不决，难以做决定',
                },{
                    sym: '自我价值感低',
                    inter: '觉得自己没用',
                },{
                    sym: '自罪感',
                    inter: '觉得自己在拖累别人',
                },{
                    sym: '无望感',
                    inter: '觉得生活失去希望、无助',
                },{
                    sym: '睡眠浅',
                    inter: '除了起床上厕所，每天晚上醒来的次数会超过两次',
                },{
                    sym: '入睡困难',
                    inter: '闭上眼睛之后需要半个小时以上才能睡着',
                },{
                    sym: '早醒',
                    inter: '早上比平时早醒了两个小时以上',
                },{
                    sym: '睡眠时间短',
                    inter: '睡眠时间比过去少了两个小时以上',
                },{
                    sym: '多噩梦',
                    inter: '和以前相比，现在更频繁地做噩梦',
                },{
                    sym: '睡眠时间过长',
                    inter: '睡眠时间比过去多了两个小时以上',
                },{
                    sym: '食欲不佳',
                    inter: '不想吃饭/懒得吃饭',
                },{
                    sym: '入睡困难',
                    inter: '闭上眼睛之后需要半个小时以上才能睡着',
                },{
                    sym: '有被动进食行为',
                    inter: '需要强迫自己去吃或者需要别人督促',
                },{
                    sym: '暴饮暴食',
                    inter: '在情绪影响下短时间内大量进食',
                },{
                    sym: '精神运动性迟滞',
                    inter: '和感觉自己讲话比平时慢，有点反应迟缓，有时甚至就像在糖浆或者泥泞中行走一样',
                },
                {
                    sym: '精神运动性激越',
                    inter: '经常感到烦躁不安，坐立难安',
                },{
                    sym: '躯体症状',
                    inter: '身体上有一些反应，比如头晕、呼吸困难、出冷汗',
                },{
                    sym: '个人生活功能受损',
                    inter: '处理生活中的小事的功能受到影响，比如清理个人卫生做家务等，可以举更详细的例子',
                },{
                    sym: '人际关系不稳定',
                    inter: '觉得与某些生活中比较重要的人的关系变差，不想与人交往',
                },{
                    sym: '工作学习效率下降',
                    inter: '无法正常完成工作学习任务，这种异常有被周围人觉察到，比如被领导批评/被老师约谈',
                },{
                    sym: '躯体疾病相关',
                    inter: '大脑或内分泌系统相关疾病包括了神经系统疾病，如癫痫、神经梅毒或脑卒中、脑肿瘤等；内科疾病，如甲状腺功能减退等',
                },{
                    sym: '精神活性物质的依赖或者戒断',
                    inter: '长期服用精神活性物质：可卡因、酒精、毒品或其他致幻剂等或最近突然戒断',
                },
                {
                    sym: '延长哀伤',
                    inter: '有亲人去世，长期处于悲伤自责状态，超过六个月以上',
                },{
                    sym: '月经周期相关',
                    inter: '每个月经周期都会出现类似症状',
                },
                {
                    sym: '双向情感障碍',
                    inter: '和过去相比，最近两周有超过四天以上有异常兴奋、话多、想法多、做事冲动和即使不睡觉也觉得精力充沛的情况',
                },



                ]
            }
        }
    }
</script>

<style scoped>
    .portrait-main {
        background-color: white;
        width: 100%;
        height: 100%;
        border: 1px lightgray solid;
        overflow: hidden;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .portrait-content {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 1rem
    }
    .tip {
        padding-bottom: 2rem;
        font-size: 14px;
        color: grey;
    }
</style>