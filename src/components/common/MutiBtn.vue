<template>
    <div class="mutibtn-container">
        <!-- <i :class="className"></i>  
        <span>{{nameText}}</span>  -->
        <el-link type="primary" :icon="className">{{nameText}}</el-link>
    </div>
</template>

<script>
export default {
    props: {
        className: {type:String},
        nameText: {type: String}
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
    .mutibtn-container {
        // font-size: 12px;
        // display: flex;
        // align-items: center;
        // color: #0096FF;
        // font-weight: 700;
        margin-right: 32px;
        // &:hover {
        //     cursor: pointer;
        // }
        // >i {
        //     font-size: 16px;
        //     font-weight: 700;
        //     margin-right: 4px;
        // }
        .el-link {
            font-size: 12px;
            font-weight: 700;
        }
    }
</style>
