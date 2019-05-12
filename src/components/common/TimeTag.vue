<template>
    <div class="time-container">
        <p>{{data.text}}</p>
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
        p {
            white-space: nowrap;
            overflow: hidden;
        }
        .el-date-editor {
            margin: 0 20px;
            width: 180px;
        }
    }
</style>

