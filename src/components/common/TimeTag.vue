<template>
    <div class="time-container">
        <div class="text"><p>{{data.text}}</p></div>
        <el-time-picker is-range v-model="data.time" range-separator="-" start-placeholder="00:00" end-placeholder="00:00" prefix-icon="el-icon-time" 
        format="HH:mm" value-format="HH:mm" @change="changTime"> </el-time-picker>
    </div>
</template>

<script>
export default {
    props: {
        data: {type: Object}
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
                font-family: 'PingFangSC-Regular', 'PingFang SC';
                font-style: normal;
                font-size: 14px;
                color: #606266;
            }
        }
        .el-date-editor {
            margin: 0 20px;
            width: 180px;
        }
    }
</style>

