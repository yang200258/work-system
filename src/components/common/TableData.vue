<template>
    <div class="table-data">
        <div class="search-container" v-if="isSearch">
            <form-com :data="data" :formData="formData" :loadNode="loadNode" @changeMutiSelect="changeMutiSelect" @btnClick="btnClick"></form-com>
        </div>
        <el-divider v-if="isSearch"></el-divider>
        <div class="muti-option" v-if="isMutiOption">
            <div class="left-option">
                <el-checkbox v-model="isShowSelected" v-if="isSelected" @change="changeCheckBox">已选中{{selectCount}}项</el-checkbox>
                <muti-btn v-show="selectCount > 1" v-for="(item,i) in mutiItem.left" :key="i" :className="item.className" :nameText="item.nameText" @click.native="mutiOption(item)"></muti-btn>
            </div>
            <div class="right-option">
                <muti-btn v-for="(item,i) in mutiItem.right" :key="i" :className="item.className" :nameText="item.nameText" @click.native="mutiOption(item)"></muti-btn>
            </div>
        </div>
        <div class="table-container">
            <el-table ref="table" v-loading="tableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :default-sort="tableSort" :empty-text="emptyText"
            :data="tableData" @selection-change="selectionChange" :highlight-current-row="true" :header-cell-class-name="'title'" :height="height" :row-class-name="tableRowClassName">
                <el-table-column type="selection" align="left" v-if="isSelected"> </el-table-column>
                <el-table-column v-for="(item,index) in head" :prop="item.key" :label="item.name" :key="index" align="left" :show-overflow-tooltip="true" :sortable="item.sortable"> 
                    <template slot-scope="scope">
                        <slot name="special" :scope="scope">
                            <span v-html="format(scope.row[scope.column.property],scope.column.property,scope.row)">{{scope.row[scope.column.property]}}</span>
                        </slot>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="left" v-if="isOption" :class-name="'option'" width="140px">
                    <template slot-scope="scope">
                        <slot name="option" :scope="scope">
                            <span style="margin-right:22px;" :class="item.type == 1 ? 'edit' : 'del'" v-for="(item,index) in option" :key="index" @click.prevent="optionEvent(scope,item)">{{item.name}}</span>
                        </slot>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="page.pageSize" 
                layout="total, sizes, prev, pager, next, jumper" :total="totalNumber" background class="page" v-if="page.isPagination"></el-pagination>
        </div>
    </div>
</template>

<script>
import FormCom from './FormCom'
import MutiBtn from './MutiBtn'
export default {
    /* eslint-disable */
    props: {
        height: {type:Number},
        //特殊标注区
        tableRowClassName: {type: Function,default: function() {}},
        //表格上方搜索区
        isSearch: {type:Boolean,default: true},
        data: {type: Object},
        formData: {type:Array},
        loadNode: {
            type: Function,
            default: function() {}
        },
        //表格上方批量操作区
        isMutiOption: {type:Boolean,default:true},
        mutiItem: {type:Object,default: function() {return {left:[],right:[]}} },
        // 表格区
        tableLoading: { type: Boolean, default: false },
        tableSort: {type:Object},
        tableData: {type: Array},
        head: {type: Array},
        isSelected: { type: Boolean, default: true },
        emptyText: {type:String,default: '暂无数据'},
        // formatter: {type: Function,default: function(row, column,cellValue, index) {
        //     return cellValue
        // }},
        format: {type:Function,default: function(cellValue,property) {return cellValue }},
        // 操作区
        isOption: {type:Boolean,default: true},
        option: {type:Array,default:()=> {return [{name: '编辑',event: 'editTable',type:1},{name: '删除',event: 'delTable',type:2}]}},
        //分页区
        page: {type:Object,default: ()=> {return {isPagination:true,currentPage:1,pageSize:1} }},
        totalNumber:  { type: Number,default: 0 },
    },
    data(){
        return{
            isShowSelected: false,
            selectCount: 0,
            selectdata: []
        }
    },
    watch: {
    },
    components: {
        FormCom,
        MutiBtn
    },
    methods: {
        sizeChange(val) {
            this.$emit('sizeChange',val)
        },
        currentChange(val) {
            this.$emit('currentChange',val)
        },
        optionEvent: function(scope,item) {
            this.$emit(item.event,scope)
        },
        selectionChange: function(val){
            this.selectCount = val.length
            this.selectdata = val
            this.$emit('selectionChange',val)
        },
        btnClick: function() {
            this.$emit('btnClick')
        },
        //处理批量操作事件分发
        mutiOption: function(item) {
            this.$emit(item.event)
        },
        //处理多选时子组件中所选数据
        changeMutiSelect: function(val1,val2) {
            this.$emit('changeMutiSelect',val1,val2)
        },
        //设置已选状态下选择
        async changeCheckBox(val) {
            await this.$emit('showSlect',val)
            val ? this.$refs.table.toggleAllSelection() : this.toggleSelection(this.selectdata)
            
        },
        toggleSelection: function(rows) {
            if(rows) {
                rows.forEach(item=> {
                    this.$refs.table.toggleRowSelection(item)
                })
            }
        }
        
    }
}
</script>

<style lang="scss">
    .table-data {
        .search-container {
            padding: 0 32px;
        }
        .muti-option {
            margin-left: 42px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 22px;
            .left-option {
                display: flex;
                align-items: center;
                .el-checkbox {
                    width: 84px;
                    .el-checkbox__label {
                        font-size:12px;
                    }
                }
            }
            .right-option {
                display: flex;
                align-items: center;
                margin-right: 50px;
            }
            
            
        }
        .table-container {
            padding: 0 32px;
            .el-table .success-row {
                color: #409eff;
            }
            .el-table {
                // 滚动条的宽度
                /deep/ .el-table__body-wrapper::-webkit-scrollbar {
                    height: 2px; // 纵向滚动条 必写
                    width: 6px;
                }
                // 滚动条的滑块
                /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
                    background-color: rgba(144,147,153,.3);
                    border-radius: inherit;
                    cursor: pointer;
                    transition: .3s background-color;
                }
                //设置操作栏的按钮不换行
                /deep/ .el-table__row {
                    .option {
                        .cell {
                            display: flex;
                            align-items: center;
                            span {
                                white-space: nowrap;
                            }
                        }
                    }
                }
                
            }
            .title {
                font-weight: 700;
                color: black;
            }
            .cell {
                font-size: 12px;
            }
            //操作按钮样式
            .edit {
                color: #0096FF;
                &:hover {
                    cursor:pointer;
                }
            }
            .del {
               color: #FF3F3F;
               &:hover {
                    cursor:pointer;
                }
            }
            .page {
                // position: absolute;
                // float: right;
                // right: 48px;
                display: flex;
                justify-content: flex-end;
                margin-top: 20px;
                margin-right: 48px;
                .el-pagination__total {
                    font-size: 12px;
                }
                .el-pager {
                    li {
                       font-size: 12px;
                       font-weight: 400; 
                    }
                }
                .el-pagination__jump {
                    font-size: 12px;
                }
            }
        }
    }
</style>

