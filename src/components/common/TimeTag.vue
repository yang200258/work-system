<template>
    <div class="time-container">
        <p class="text">{{data.text}}</p>
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
            
        }
    },
    methods: {
        changTime: function(val) {
            this.$emit('changTime',val)
        }
    }
}
</script>

<style lang="scss" scoped>
    .time-container {
        display: flex;
        align-items: center;
        .text {
            white-space: nowrap;
            overflow: hidden;
            text-align: left;
            font-size: 12px;
            color: #666;
            display: block;
            width: 54px;
        }
        .el-date-editor {
            width: 150px;
            margin-left: 9px;
        }
    }
</style>

