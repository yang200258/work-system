<template>
    <div class="clocksite-container">
        <header>
            <div class="search">
                <el-input placeholder="请输入地点名称" suffix-icon="el-icon-search" size="mini" v-model="searchInfo.info"> </el-input>
                <el-input placeholder="请输入城市" v-model="searchInfo.city" size="mini"> </el-input>
            </div>
            <el-button type="primary" size="mini" @click.prevent="createSite">创建</el-button>
        </header>
        <section>
            <table-data :head="sitehead" :tableData="siteInfo.content" :isSelected="false" :option="option"  :totalNumber="siteInfo.total" @delTable="delSite(scope)" @editTable="querySite(scope)" @chooseTable="chooseSite(scope)">
                <template #special="{scope: scope}">
                    <slot name="clockstyle" :scope="scope"></slot>
                </template>
            </table-data>
        </section>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
export default {
    props: {
        searchInfo: {type: Object},
        siteInfo: {type:Object},
        sitehead: {type:Array},
        option: {type: Array}
    },
    data() {
        return {
            
        }
    },
    methods: {
        querySite: function(scope) {
            this.$emit('querySite',scope)
        },
        chooseSite: function(scope) {
            this.$emit('chooseSite',scope)
        },
        delSite: function(scope) {
            this.$emit('delSite',scope)
        }
    },
    components: {
        TableData
    }
}
</script>

<style lang="scss" scoped>
    .clocksite-container{
        header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            .el-input {
                width: 200px;
                margin-right: 20px;
            }
            .el-button {
                position: relative;
                right: 0;
                width: 80px;
            }
        }
    }
</style>
