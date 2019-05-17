<template>
    <div class="clockgroup-manage">
        <header class="clockgroup-header">
            <div class="left">
                <el-input v-model="searchInfo" placeholder="请输入内容"></el-input>
                <el-button icon="el-icon-search" type="primary">搜索</el-button>
            </div>
            <el-button icon="el-icon-edit" type="primary" @click="addClockGroup">添加</el-button>
        </header>
        <section class="clockgroup-content">
            <table-data :head="head" :tableData="clockGroupData" :tableLoading="clockGroupLoading" :option="option"></table-data>
        </section>
        <my-dialog>
            
        </my-dialog>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
import MyDialog from '@/components/common/MyDialog'
export default {
    data() {
        return {
            searchInfo: '',
            head:[{key: 'name',label:'考勤组名称'},{key: '',label:'考勤地点/打卡方式'},{key: '',label:'班次类型'},{key: '',label:'成员数'},{key: '',label:'创建人'},
                    {key: '',label:'更新时间'}],
            clockGroupData: [],
            clockGroupLoading: false,
            option:[{name: '查看',type:'success',event: 'chooseTable'},{name: '编辑',type:'primary',event: 'editTable'},{name:'删除',type:'danger',event: 'delTable'}],
        }
    },
    components: {TableData,MyDialog},
    methods: {
        addClockGroup: function() {
            
        }
    }
}
</script>

<style lang="scss" scoped>
    .clockgroup-manage {
        margin: 0 40px;
        .clockgroup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .el-button {
                margin-left: 20px;
            }
            .left {
                display: flex;
                align-items: center;
            }
        }
    }
</style>

