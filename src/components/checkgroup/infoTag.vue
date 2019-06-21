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
        font-size: 12px;
        color: #666;
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
                    
                    display: block;
                    text-align: right;
                }
            }
            .infotag-right {
                margin-left: 20px;
                overflow: hidden;
            }
        }
        
    }
</style>
