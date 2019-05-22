<template>
    <div class="specialday-container">
        <el-popover placement="right" width="600"  trigger="click" v-model="visible">
            <div class="popover-container">
                <div class="set-work-rest" v-if="setData.type !== 1" style="font-size:18px;text-align:center;">
                    <p class="text">确定修改{{formatDay}}为{{setData.type === 0?'上班日':'休息日'}}？？</p><br>
                    <p class="text">本设置将覆盖该日以前的特殊设置</p>
                </div>
                <div class="set-time" v-if="setData.type == 1">
                    <time-tag :time="timeTagData"></time-tag>
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
import TimeTag from './timeTag'
export default {
    props: {
        setData: {type:Object},
        day: {type:String},
        // timeTagData: {type:Array}
    },
    data() {
        return {
            visible: false,
            timeTagData: [{worktime:['00:00','23:59'],quit: false,key: new Date(),here: false}],
        }
    },
    components: {
        TimeTag
    },
    watch: {
        visible: function(val) {
            if(!val) this.timeTagData = [{worktime:['00:00','23:59'],quit: false,key: new Date(),here: false}]
        }
    },
    methods: {
        submitSet: function() {
            this.visible = false
            this.$emit('submitSet',this.timeTagData)
        },
        cancelSet: function() {
            this.visible = false
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



