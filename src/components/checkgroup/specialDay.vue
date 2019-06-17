<template>
    <div class="specialday-container">
        <el-popover placement="right" width="900"  trigger="click" v-model="visible">
            <div class="popover-container">
                <div class="set-work-rest" v-if="setData.type !== 0" style="font-size:18px;text-align:center;">
                    <p class="text" style="text-align:left;font-size:12px;color: #666">确定修改{{formatDay}}为{{setData.type === 1 ? '上班日':'休息日'}}？本设置将覆盖该日以前的特殊设置</p>
                    <!-- <p class="text" style="text-align:center;font-size:12px">本设置将覆盖该日以前的特殊设置</p> -->
                    <el-input type="textarea" :rows="3" placeholder="请输入原因" v-model="reason" style="margin-top:12px;"></el-input>
                </div>
                <div class="set-time" v-if="setData.type == 0">
                    <clock-count-times></clock-count-times>
                    <el-input type="textarea" :rows="3" placeholder="请输入原因" v-model="reason" style="margin-top:12px;"></el-input>
                </div>
            </div>
            <div style="text-align: center;margin: 30px;" class="option">
                <el-button size="mini" @click="cancelSet" style="margin-right: 20px;">取消</el-button>
                <el-button type="primary" size="mini" @click="submitSet">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="primary">{{setData.buttonText}}</el-button>
        </el-popover>
    </div>
</template>

<script>
import ClockCountTimes from '@/components/checkgroup/clockCountTimes'
import utils from '@/utils/utils'
export default {
    props: {
        setData: {type:Object},
        day: {type:String},
    },
    data() {
        return {
            visible: false,
            reason: ''
        }
    },
    components: {
        ClockCountTimes
    },
    watch: {
    },
    methods: {
        submitSet: function() {
            if(utils.isStringEmpty(this.reason)) return this.$message.error('理由不能为空！')
            this.visible = false
            this.$emit('submitSet',this.reason,this.setData.type)
            this.reason = ''
        },
        cancelSet: function() {
            this.visible = false
            this.reason = ''
            this.$emit('cancelSet')
            
        }
    },
    computed: {
        formatDay: function() {
            let date = this.day.split('-')
            return date[0] + '年' + date[1] + '月' + date[2] + '日'
        }
    }
}
</script>

<style lang="scss" scoped>
.specialday-container {
    .text {
        font-size: 12px;
    }
}
</style>




