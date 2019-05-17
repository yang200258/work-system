<template>
    <div class="create-group-container">
        <header class="group-header">
            <p>海南大厦26层-9点至17点30分</p>
            <el-steps :active="active" finish-status="success">
                <el-step v-for="(item,i) in steps" :key="i" :title="item"></el-step>
            </el-steps>
        </header>
        <section class="create-content">
            <div class="worktype">
                <div class="worktype-header">
                    <span>打卡次数</span>
                    <span>工作时段设置</span>
                </div>
                <div class="worktype-content">
                    <clock-count v-for="(item,i) in countData" :key="i" :countData="item"></clock-count>
                </div>
            </div>
        </section>
        <footer class="create-footer">
            <el-button>上一步</el-button>
            <el-button>下一步</el-button>
        </footer>
    </div>
</template>

<script>
import ClockCount from '@/components/checkgroup/clockCount'
export default {
    data() {
        return {
            active: 0,
            steps: ['班次设置','考勤地点设置','考勤组成员编辑','特殊日期设置'],
            countData: [{type:0,text:'两次',clockNum: [{text: '工作时段',time: ''},{text: '休息时段',time: ''}]},{type:1,text:'四次',clockNum: [{text: '工作时段1',time: ''},{text: '工作时段2',time: ''}]},
                            {type:2,text:'六次',clockNum: [{text: '工作时段1',time: ''},{text: '工作时段2',time: ''},{text: '工作时段3',time: ''}]},]
        }
    },
    components: {
        ClockCount
    }
}
</script>


<style lang="scss" scoped>
    .create-group-container {
        .group-header {
            margin: 20px;
            p {
                white-space: nowrap;
                font-family: 'PingFangSC-Regular', 'PingFang SC';
                font-weight: 400;
                font-style: normal;
                font-size: 20px;
                color: #999999;
            }
            .el-steps {
                margin: 30px;
            }
        }
        .create-content {
            margin:40px;
            padding: 40px;
            .worktype {
                .worktype-header {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 50px;
                    line-height: 50px;
                    span {
                            font-family: PingFangSC-Semibold, "PingFang SC Semibold", "PingFang SC";
                            font-weight: 650;
                            font-style: normal;
                            font-size: 13px;
                            color: rgb(51, 51, 51);
                    }
                }
            }
        }
        .create-footer {
            margin: 20px;
            display: flex;
            justify-content: center;
        }
    }
</style>
