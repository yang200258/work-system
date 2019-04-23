<template>
    <div class="table-data">
        <el-main style="padding:0">
            <el-container class="infoTable">
                <el-main style="padding:0">
                        <el-table  v-loading="loadingTable" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :default-sort="{prop:'sort', order: 'ascending'}"
                        :data="tableData" @selection-change="handleSelectionChange" :highlight-current-row="true"  :row-key="getRowKey">
                            <el-table-column type="selection" align="center" v-if="isSelected"> </el-table-column>
                            <el-table-column v-for="(item,index) in head" :prop="item.key" :label="item.name" :key="index" align="center" :show-overflow-tooltip="true" 
                            :reserve-selection="true"> </el-table-column>
                            <el-table-column label="操作" align="center" v-if="isOption">
                                <template slot-scope="scope">
                                    <el-button  type="text" size="small" @click.prevent="editInfo(scope)" v-if="isEditTable" style="color: #199ED8">{{editTableName}}</el-button>
                                    <el-button  type="text" size="small" @click.prevent="editAccount(scope)" v-if="isEditAccount" style="color: #199ED8">{{editAccountName}}</el-button>
                                    <el-button  type="text" size="small" @click.prevent="deleteInfo(scope)" v-if="isDeleteTable" style="color: red">{{deleteTableName}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination class="page" v-if="isPagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[50]" :page-size="pageSize" layout="prev, pager, next" :total="totalNumber">
                        </el-pagination>
                </el-main>
            </el-container>
        </el-main>
    </div>
</template>

<script>
export default {
    data(){
        return{
            
        }
    },
    components: {
    },
    props: ['isEditAccount','editAccountName','loadingAddInformTable','addInformData','editType','isPagination','head','loadingTable','currentPage','pageSize','totalNumber','isEdit','isDelete','tableData',
             'editName','deleteName','isEditTable','editTableName','isDeleteTable','deleteTableName','isSelected','isOption','optionName','isEditOption'],
    methods: {
        handleSizeChange(val) {
            
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.$emit('handleCurrentChange',val)
        },
        editOption: function(){
            this.$emit('editOption')
        },
        deleteOption: function(){
            this.$emit('deleteOption')
        },
        editInfo: function(scope){
            this.$emit('editInfo',scope)
        },
        editAccount: function(scope){
            this.$emit('editAccount',scope)
        },
        deleteInfo: function(scope){
            this.$emit('deleteInfo',scope)
        },
        handleSelectionChange: function(val){
            this.$emit('handleSelectionChange',val)
        },
        getRowKey: function(row){
            this.$emit('getRowKey',row)
        },
        option: function(){
            this.$emit('option')
        }

    }
}
</script>

<style lang="scss" scoped>
    .table-data{
        .infoTable {
            display: flex;
            flex-direction: column;
            .el-main {
                // margin-left: 0;
                .cell {
                    box-sizing: border-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: normal;
                    word-break: break-all;
                    line-height: 23px;
                    padding-left: 10px;
                    padding-right: 10px;
                    text-align: left;
                }
                .page {
                    position: absolute;
                    right: 5%;
                }
            }
        }
    }
</style>

