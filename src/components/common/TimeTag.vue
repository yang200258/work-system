<template>
    <div class="time-container">
        <div class="text"><p>{{data.text}}</p></div>
        <el-time-picker is-range v-model="data.time" range-separator="-" start-placeholder="00:00" end-placeholder="00:00" prefix-icon="el-icon-time" 
            format="HH:mm" value-format="HH:mm" @change="changTime" :readonly="readonly" :size="size"> </el-time-picker>
    </div>
</template>

<script>
export default {
    props: {
        data: {type: Object},
        readonly: {type:Boolean,default:false},
        size: {type:String,default: 'mini'}
    },
    data() {
        return {
            time: ''
        }
    },
    methods: {
        changTime: function() {
            this.$emit('changTime',this.data)
        }
    }
}
</script>

<style lang="scss" scoped>
    .time-container {
        display: flex;
        align-items: center;
        .text {
            width: 72px;
            white-space: nowrap;
            overflow: hidden;
            p {
                font-style: normal;
                font-size: 12px;
                color: #606266;
            }
        }
        .el-date-editor {
            margin: 0 20px;
            width: 180px;
        }
    }
</style>

