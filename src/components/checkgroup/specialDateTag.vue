<template>
    <div class="specialtag-container">
        <div class="specialtag-header">
            <p>日期</p>
            <p>设置</p>
        </div>
        <div class="specialtag-content" v-for="(item,i) in data" :key="i">
            <div class="date">
                {{item.date}}
            </div>
            <div class="setting">
                <span>{{val[item.type]}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data:{type:Array}
    },
    data() {
        return {
            val: ['调整时间', '上班', '休息']
        }
    }
}
</script>


<style lang="scss" scoped>
    .specialtag-container {
        display: flex;
        flex-direction: column;
        .specialtag-header {
            display: grid;
            grid-template-columns: 200px 100px;
            p {
                color: #606266;
                &:first-child {
                    min-width: 200px;
                }
            }
        }
        .specialtag-content {
            width: 300px;
            display: grid;
            grid-template-columns: 200px 100px;
            height: 40px;
            border-bottom: 1px dashed #ccc;
            line-height: 50px;
            .date {
                min-width: 200px;
                a {
                    color: #409EFF;
                    font-size: 14px;
                    cursor: pointer;
                }
            }
        }
    }
</style>
