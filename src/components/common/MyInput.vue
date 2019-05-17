<template>
    <div class="myinput-container">
        <div class="text">
            <p>{{data.text}}</p>
            <el-input type="text" :placeholder="data.placeholder" v-model="data.info" clearable></el-input>
        </div>
        <div class="input-wrapper">
            <slot name="tip" class="tip"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {type:Object},
    },
    data() {
        return {
        }
    },
}
</script>

<style lang="scss" scoped>
    .myinput-container {
        display: flex;
        flex-direction: column;
        .text {
            display: flex;
            align-items: center;
            p {
                white-space: nowrap;
                font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC';
                font-style: normal;
                color: #666666;
                font-size: 14px;
            }
            .el-input {
                margin-left: 20px;
            }
        }
        .input-wrapper {
            padding-left: 90px;
            margin-top: 10px;
        }
        
    }
</style>

