<template>
    <div class="infotag-container">
        <div class="infotag-content">
            <div class="infotag-left">
                <span>{{text}}：</span>
            </div>
            <div class="infotag-right">
                <slot name="info-tag">{{info}}</slot>
            </div>
        </div>
        <el-divider></el-divider>
    </div>
</template>

<script>
export default {
    props: {
        text: {type:String},
        info: {type:String}
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
    .infotag-container {
        display: flex;
        flex-direction: column;
        .infotag-content {
            display: grid;
            grid-template-columns: 100px auto;
            .infotag-left{
                margin: auto 0;
                span {
                    white-space: nowrap;
                    font-weight: 400;
                    font-size: 14px;
                    display: block;
                    text-align: right;
                }
            }
            .infotag-right {
                font-size: 14px;
                color: #999999;
                margin-left: 20px;
                overflow: hidden;
            }
        }
        
    }
</style>
