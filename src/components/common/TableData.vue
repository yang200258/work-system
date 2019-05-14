<template>
    <div class="table-data">
        <el-main style="padding:0">
            <el-container class="infoTable">
                <el-main style="padding:0">
                        <el-table  v-loading="tableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :default-sort="tableSort"
                        :data="tableData" @selection-change="selectionChange" :highlight-current-row="true" :header-cell-class-name="'title'">
                            <el-table-column type="selection" align="center" v-if="isSelected"> </el-table-column>
                            <el-table-column v-for="(item,index) in head" :prop="item.key" :label="item.name" :key="index"
                             align="center" :show-overflow-tooltip="true" :formatter="formatter"> 
                                <template slot-scope="scope" >
                                    <img v-if="scope.column.property == 'avater'" :src="scope.row.avater" style="max-width: 40px;border-radius: 50%;">
                                    <p v-else>{{scope.row[item.key]}}</p>
                                </template>
                             </el-table-column>
                            <el-table-column label="操作" align="center" v-if="isOption">
                                <template slot-scope="scope" v-if="scope.row.status !== '离职'" >
                                    <slot name="option" :scope="scope"></slot>
                                    <el-button :style="editStyle" :type="optionType.edit"  size="mini" @click.prevent="editTable(scope)" v-if="isEditTable" >{{editTableName}}</el-button>
                                    <el-button :style="scope.row.status == '停用'?'':delStyle" :type="optionType.delete" size="mini" @click.prevent="deleteTable(scope)" v-if="isDeleteTable">{{scope.row.status == '停用'?'启用':deleteTableName}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" 
                        layout="total, sizes, prev, pager, next, jumper" :total="totalNumber" background class="page" v-if="isPagination"></el-pagination>
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
        formatter: {type: Function,default: function(row, column,cellValue, index) {
            return cellValue
        }},
        // 操作区
        isOption: { type: Boolean, default: true },
        isEditTable: { type: Boolean, default: true },
        editTableName: { type: String, default: '编辑' },
        isDeleteTable: { type: Boolean, default: true },
        deleteTableName: { type: String, default: ' ' },
        optionType: {type: Object,default: function() {return {'edit':'text','delete':'text'}  } },
        //分页区
        isPagination: { type: Boolean, default: true },
        currentPage:{ type: Number,default: 1 },
        pageSize: { type: Number,default: 1 },
        totalNumber:  { type: Number,default: 0 },
        //样式区
        optionStyle: {type: Object,default:function() {return {}  }},
        editStyle: {type: Object,default:function() {return {}  }},
        delStyle: {type: Object,default: function() {return {color: 'red'}  } },
    },
    data(){
        return{
            isSHow: true
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
        // formatter: function(row, column,cellValue, index){
        //     this.$emit('formatter',row, column,cellValue, index)
        // },
    }
}
</script>

<style lang="scss">
    .table-data{
        .infoTable {
            display: flex;
            flex-direction: column;
            .el-main {
                .title {
                    font-weight: 700;
                    color: black;
                }
                .hide {
                    display: none;
                }
                .cell {
                    &.el-tooltip {
                        box-sizing: border-box;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: normal;
                        word-break: break-all;
                        // line-height: 23px;
                        // padding-left: 10px;
                        // padding-right: 10px;
                        // text-align: left;
                    }
                    
                }
                .page {
                    position: absolute;
                    right: 4%;
                    margin-top: 12px;
                }
            }
        }
    }
</style>

