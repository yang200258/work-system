<template>
    <div class="myinput-container">
        <p>{{data.text}}</p>
        <el-select v-model="data.info" multiple collapse-tags style="margin-left: 20px;" :placeholder="data.placeholder">
            <el-option v-for="item in data.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    props: {
        data: {type:Object},
        // info: {type: Array}
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
    .myinput-container {
        display: flex;
        align-items: center;
        p {
            display: block;
            white-space: nowrap;
            font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC';
            font-style: normal;
            color: #666666;
            font-size: 14px;
        }
        .el-input {
            margin-left: 6px;
        }
    }
</style>

