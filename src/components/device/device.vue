<template>
    <div class="bluetooth-manage">
        <header class="bluetooth-header">
            <el-input v-model="searchInfo.no" placeholder="设备编号"></el-input>
            <el-checkbox v-model="searchInfo.isException">只显示通信异常设备（最近5天没有通信）</el-checkbox>
            <el-button icon="el-icon-search" type="primary" @click="searchDevice">搜索</el-button>
        </header>
        <section class="bluetooth-content">
            <table-data :head="table.head" :isSelected="false" :tableData="table.content" :tableLoading="table.loading" :option="option" :totalNumber="table.total" @currentChange="currentChange" @chooseTable="chooseTable"
            @editTable="editTable" @delTable="delTable"></table-data>
        </section>
    </div>
</template>
<script>
import TableData from '@/components/common/TableData'
export default {
    props: {
        table: {type: Object},
        searchInfo: {type: Object},
    },
    data() {
        return {
            option:[{name: '查看',type:'success',event: 'chooseTable'},{name: '编辑',type:'primary',event: 'editTable'},{name:'停用',type:'danger',event: 'delTable'}],
        }
    },
    components: {
        TableData,
        // MyDialog
        },
    methods: {
        searchDevice: function() {
            this.$emit('searchDevice',this.searchInfo)
        },
        currentChange: function(val) {
            this.$emit('currentChange',val)
        },
        delTable: function(scope) {
            this.$emit('delTable',scope)
        },
        editTable: function(scope) {
            this.$emit('editTable',scope)
        },
        chooseTable: function(scope) {
            this.$emit('chooseTable',scope)
        }
    }
}
</script>

<style lang="scss" scoped>
    .bluetooth-manage {
        margin: 20px 40px;
        .bluetooth-header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .el-checkbox {
                margin: 0 20px;
            }
            .el-input {
                width: 200px;
            }
        }
        .bluetooth-content {
            margin-top: 10px;
        }
    }
</style>

