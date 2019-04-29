<template>
    <div class="table-data">
        <el-main style="padding:0">
            <el-container class="infoTable">
                <el-main style="padding:0">
                        <el-table  v-loading="tableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :default-sort="tableSort"
                        :data="tableData" @selection-change="selectionChange" :highlight-current-row="true">
                            <el-table-column type="selection" align="center" v-if="isSelected"> </el-table-column>
                            <el-table-column v-for="(item,index) in head" :prop="item.key" :label="item.name" :key="index"
                             align="center" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column label="操作" align="center" v-if="isOption">
                                <template slot-scope="scope">
                                    <el-button  :type="optionType.edit" :class="editStyle" size="mini" @click.prevent="editTable(scope)" v-if="isEditTable">{{editTableName}}</el-button>
                                    <el-button  :type="optionType.delete" :class="deleteStyle" size="mini" @click.prevent="deleteTable(scope)" v-if="isDeleteTable">{{deleteTableName}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination background class="page" v-if="isPagination" @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[20]" :page-size.sync="pageSize" layout="prev, pager, next" :total="totalNumber">
                        </el-pagination>
                </el-main>
            </el-container>
        </el-main>
    </div>
</template>

<script>
export default {
    /* eslint-disable */
    props: {
        // 表格区
        tableLoading: { type: Boolean, default: false },
        tableSort: {prop:'sort', order: 'ascending'},
        tableData: {type: Array},
        head: {type: Array},
        isSelected: { type: Boolean, default: true },
        // 操作区
        isOption: { type: Boolean, default: true },
        isEditTable: { type: Boolean, default: true },
        editTableName: { type: String, default: '编辑' },
        isDeleteTable: { type: Boolean, default: true },
        deleteTableName: { type: String, default: ' ' },
        optionType: {type: Object,default: function() {return {'edit':'text','delete':'text'}  } },
        editStyle: {type: String,default:''},
        deleteStyle:{type: String,defult: '.deleteStyle {color: red}'},
        //分页区
        isPagination: { type: Boolean, default: true },
        currentPage:{ type: Number,default: 1 },
        pageSize: { type: Number,default: 1 },
        totalNumber:  { type: Number,default: 0 },
    },
    data(){
        return{
            
        }
    },
    components: {
    },
    methods: {
        sizeChange(val) {
            console.log(`每页 ${val} 条`);
             this.$emit('sizeChange',val)
        },
        currentChange(val) {
            // console.log(`当前页: ${val}`);
            this.$emit('currentChange',val)
        },
        editTable: function(scope){
            this.$emit('editTable',scope)
        },
        deleteTable: function(scope){
            this.$emit('deleteTable',scope)
        },
        selectionChange: function(val){
            this.$emit('selectionChange',val)
        },
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

