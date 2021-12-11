<template>
    <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <div style="font-family: 'Helvetica Neue';font-size: large">评估报告</div>
        <div class="subTitle" >症状评估</div>
        <div id="radar_canvas" class="echart" style="width: 400px;height: 300px;"></div>
        <div class="subTitle">风险评估</div>
        <el-row :gutter="20" class="content">
            <el-col :span="12" style="font-size: smaller">抑郁风险: {{dRisks}}</el-col>
            <el-col :span="12" style="font-size: smaller">自杀风险: {{sRisks}}</el-col>
        </el-row>
        <div v-if="riskText">{{riskText}}</div>
        <div v-for="(item,index) of this.description" >
            <div v-if="item.content!=''">{{item.content}}</div>
        </div>
        <div v-if="relationText" class="subTitle">关联性评估</div>
    </div>
</template>

<script>
    import echarts from 'echarts';
    const relates = new Map([[0,"躯体疾病"],[1,"延长哀伤"],[2,"物质依赖或戒断"],[3,"双相情感障碍"],[4,"月经周期"]]);
    export default {
        name: 'Report',
        props: {
            items: Array,
            description: Array
        },
        data() {
            return {
                dRisks:'',
                sRisks:'',
                relationText:null,
                riskText:null
            }
        },
        // mounted() {
        //     this.drawLine()
        // },
        methods: {
            initRadar(input) {
                let charts = this.$echarts.init(document.getElementById('radar_canvas'));
                var option = {
                    radar: {
                        shape: 'circle',
                        indicator: [
                            // { name: '情绪低落', max: 4 },
                            // { name: '自杀倾向', max: 8 },
                            // { name: '社会功能', max: 6 },
                            // { name: '躯体症状', max: 3 },
                            // { name: '食欲问题', max: 4 },
                            // { name: '睡眠问题', max: 6 },
                            // { name: '精神状态不佳',max: 4},
                            // { name: '兴趣低下', max: 3 },

                            { name: '情绪低落', max: 4 },
                            { name: '兴趣低下', max: 3 },
                            { name: '精神状态不佳',max: 4},
                            { name: '睡眠问题', max: 6 },
                            { name: '食欲问题', max: 4 },
                            { name: '躯体症状', max: 3 },
                            { name: '社会功能', max: 6 },
                            { name: '自杀倾向', max: 8 },
                        ]
                    },
                    series: [
                        {
                            name: 'Budget vs spending',
                            type: 'radar',
                            areaStyle: {
                                color: '#81acf8'
                            },
                            lineStyle: {
                                color: '#81acf8'
                            },
                            color:'#81acf8',
                            data: [
                                {
                                    value: [0,0,0,0,0,0,0,0],
                                    name: 'Allocated Budget'
                                },
                            ]
                        }
                    ]
                };
                charts.setOption(option);
                window.addEventListener("resize", () => { charts.resize();});
            },

            getSymptom(i){
                let syms = [];
                for (let i = 2; i < 8; i++) {
                    let val1 = 0;
                    val1 = parseInt(this.items[i].content);
                    if((val1>0&&i!==3&&i!==7)||(val1>1&&i===3)||(val1>4&&i===7)){
                        syms.push(this.items[i]);
                    }
                }
                return syms;
            },

            getRisk(){
                let syms = this.getSymptom();
                console.log("getRisk: begin",syms);
                let deRiskValue = 0;
                let suRiskValue = 0;
                let  p1=0,p2=0,p8=0;

                p1 =parseInt(this.items[0].content);
                p2 = parseInt(this.items[1].content);
                p8 = parseInt(this.items[7].content);

                if(p1>1&&p2>0){
                    switch (syms.length){
                        case 0: case 1: case 2:
                            deRiskValue = 2;
                            break;
                        case 3:
                            deRiskValue = 3;
                            break;
                        case 4: case 5:
                            deRiskValue = 4;
                            break;
                        case 6:
                            deRiskValue = 5;
                            break;
                        default:
                            break;
                    }
                }else if(p1>1||p2>0){
                    switch (syms.length){
                        case 0: case 1: case 2:
                            deRiskValue = 1;
                            break;
                        case 3:
                            deRiskValue = 2;
                            break;
                        case 4:
                            deRiskValue = 3;
                            break;
                        case 5:
                            deRiskValue = 4;
                        case 6:
                            deRiskValue = 5;
                            break;
                        default:
                            break;
                    }
                }
                if((p1>3||p2>2)&&deRiskValue!==5){
                    deRiskValue = deRiskValue+1;
                }
                if(p8===7&&deRiskValue<4){
                    deRiskValue = 4;
                }else if(p8>4&&deRiskValue<3){
                    deRiskValue = 3;
                }
                switch (p8){
                    case 0: case 1: case 2:
                        suRiskValue = 0;
                        break;
                    case 3: case 4:
                        suRiskValue = 1;
                        break;
                    case 5: case 6:
                        suRiskValue = 2;
                        break;
                    case 7:
                        suRiskValue = 3;
                        break;
                    case 8:
                        suRiskValue = 4;
                        break;
                    default:
                        break;
                }

                switch (deRiskValue) {
                    case 0:
                        this.dRisks = "暂无抑郁风险";
                        break;
                    case 1:
                        this.dRisks = "轻度";
                        break;
                    case 2:
                        this.dRisks = "轻中度";
                        break;
                    case 3:
                        this.dRisks = "中度";
                        break;
                    case 4:
                        this.dRisks = "中重度";
                        break;
                    case 5:
                        this.dRisks = "重度";
                        break;
                }
                console.log();
                switch (suRiskValue) {
                    case 0:
                        this.sRisks = "暂无自杀风险";
                        break;
                    case 1:
                        this.sRisks = "轻度";
                        break;
                    case 2:
                        this.sRisks = "中度";
                        break;
                    case 3:
                        this.sRisks = "中重度";
                        break;
                    case 5:
                        this.sRisks = "重度";
                        break;
                }
                if(syms.length!==0){
                    this.riskText = "相关症状如下：";
                }

            },

            getRelated: function () {
                let relation = [];
                for (let i = 9; i < 14; i++) {
                    let val1 = 0;
                    val1 = parseInt(this.items[i].content);
                    if (val1 > 0) {
                        relation.push(relates.get(i - 9));
                    }
                }
                if (relation.length !== 0) {
                    this.relationText = "您的抑郁症状可能与";
                    for (let i = 0;i < relation.length;i++)
                    {
                        if (i != relation.length - 1)
                            this.relationText = this.relationText + relation[i] + ',';
                        else this.relationText = this.relationText + relation[i] + "相关。";
                    }
                }
            }
        },
        created: function () {
            this.$nextTick(function () {
                let data = [];
                this.items.forEach((e) => {
                    if (data.length < 8)
                        data.push(parseInt(e.content));
                });
                console.log(data);
                this.initRadar([0,0,0,0,0,0,0,0]);
            })
        },
        mounted() {
            let data=[];
            this.items.forEach((e)=>{
                if (data.length < 8)
                    data.push(parseInt(e.content));
            });
            this.initRadar([0,0,0,0,0,0,0,0]);
            console.log(data);
            // this.getRisk();
            // this.getRelated();
        }
    }
</script>

<style>
    .subTitle{
        margin-top: 1rem;
        color: #6c6c6c;
        background-color: #9abdf9;
        padding: 1rem;

    }
    .content{
        margin-top: 0.5rem;
    }
</style>