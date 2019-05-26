<template>
    <div class="clocksite-container">
        <header>
            <div class="search">
                <el-input placeholder="请输入地点名称" suffix-icon="el-icon-search" size="mini" v-model="searchInfo.name"> </el-input>
                <el-input placeholder="请输入城市" v-model="searchInfo.city" size="mini"> </el-input>
                <el-button type="primary" size="mini" @click="searchSite">搜索</el-button>
            </div>
            <el-button type="primary" size="mini" @click.prevent="createSite">创建</el-button>
        </header>
        <section>
            <table-data :head="sitehead" :tableData="siteInfo.content" :isSelected="false" :option="option"  :totalNumber="siteInfo.total" @delTable="delTable" @editTable="editTable" 
            @chooseTable="chooseTable" @currentChange="nextPage" :format="format">
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
        format: function(scope) {
            if(scope.column.property == 'clockGroup') {
                return scope.row['clockGroup'].map(item=> item.name).join(';')
            } else {
                return scope.row[scope.column.property]
            }
        },
        editTable: function(scope) {
            this.$emit('editTable',scope)
        },
        chooseTable: function(scope) {
            this.$emit('chooseTable',scope)
        },
        delTable: function(scope) {
            this.$emit('delTable',scope)
        },
        nextPage: function(val) {
            this.$emit('nextPage',val)
        },
        createSite: function() {
            this.$emit('createSite')
        },
        searchSite: function() {
            this.$emit('searchSite')
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
