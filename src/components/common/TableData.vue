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
                                <template #default="scope">
                                    <slot name="special" :scope="scope">{{scope.row[item.key]}}</slot>
                                </template>
                             </el-table-column>
                            <el-table-column label="操作" align="center" v-if="isOption">
                                <template #default="scope">
                                    <slot name="option" :scope="scope"></slot>
                                    <el-button v-for="(item,index) in option" :key="index" :style="item.style" :type="item.type"  size="mini" @click.prevent="optionEvent(scope,item)">{{item.name}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="page.pageSize" 
                        layout="total, sizes, prev, pager, next, jumper" :total="totalNumber" background class="page" v-if="page.isPagination"></el-pagination>
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
        isOption: {type:Boolean,default: true},
        option: {type:Array,default:()=> {return [{name: '编辑',type:'primary',style: {},event: 'editTable'},{name: '删除',type:'danger',style:{},event: 'delTable'}]}},
        //分页区
        page: {type:Object,default: ()=> {return {isPagination:true,currentPage:1,pageSize:1} }},
        totalNumber:  { type: Number,default: 0 },
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
            console.log(`每页 ${val} 条`)
             this.$emit('sizeChange',val)
        },
        currentChange(val) {
            this.$emit('currentChange',val)
        },
        optionEvent: function(scope,item) {
            this.$emit(item.event,scope)
        },
        selectionChange: function(val){
            this.$emit('selectionChange',val)
        },
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

