<template>
    <div class="myinput-container">
        <div class="text">
            <el-input type="text" :placeholder="placeholder" v-model="inputData" clearable :size="size"></el-input>
        </div>
        <div class="input-wrapper">
            <slot name="tip" class="tip"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        inputData: {type:String},
        placeholder: {type: String,default: '请输入内容'},
        size: {type:String,default: 'mini'}
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

