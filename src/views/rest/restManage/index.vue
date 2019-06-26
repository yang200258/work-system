<template>
    <div class="restmanage-container">
        <table-data :isSelected="false" :head="restHead" :tableLoading="loading" :tableData="restData" :data="searchInfo" :formData="formData" @inputSearch="inputSearch"
            :mutiItem="mutiItem" :option="option" @createRest="createRest" @editRest="editRest" @optionRest="optionRest" :format="format" :cellClassName="statusName"
            :filterTag="filterTag">
            <template #special="{scope: scope}">
                <div class="type-wrapper" v-if="scope.column.property === 'type'" >
                    <el-tag style="margin-right:8px;" v-for="item in scope.row.type" :key="item" :type="status[item]">{{typeContent[item]}}</el-tag>
                </div>
            </template>
        </table-data>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
export default {
    data() {
        return {
            restHead: [{key:'name',name:'假期名称'},{key:'unit',name:'请假单位',filters:[{text:'按天请假',value:'按天请假'},{text:'按小时请假',value:'按小时请假'}]},
                {key:'type',name:'可用员工类型',filters:[{text:'正式员工',value:0},{text:'外包员工',value:1},{text:'劳务派遣',value:2}]},
                {key:'state',name:'状态'},{key:'rule',name:'余额规则'}],
            loading: false,
            restData:[{name: '年假',unit:'按天请假',type:[0,1,2],state:0,rule:'每年1月1日自动发放5天'},{name: '年假',unit:'按小时请假',type:[1,2],state:1,rule:'每年1月1日自动发放5天'}],
            searchInfo:{},
            formData: [{type:'input',placeholder:'输入名称搜索',label:'name',isSuffix: true}],
            mutiItem:{right:[{nameText:'新增',className:'el-icon-circle-plus-outline',event:'createRest'}]},
            option: [{name:'编辑',type:1,event:'editRest'},{name:'启用',type:1,event:'optionRest'},{name:'禁用',type:2,event:'optionRest'}],
            status: ['success','','info'],
            typeContent: ['正式','劳派','外包'],
        }
    },
    components: {TableData},
    methods: {
        //按名称搜索假期
        inputSearch: function() {

        },
        //创建假期
        createRest: function() {

        },
        //编辑假期
        editRest: function() {

        },
        //启用、禁用假期
        optionRest: function() {

        },
        format: function(cellValue,propperty) {
            switch(propperty) {
                case 'state':
                    return cellValue ? '禁用' : '启用'
                default:
                    return cellValue
            }
        },
        //根据假期状态显示状态样式
        // eslint-disable-next-line
        statusName: function({row, column, rowIndex, columnIndex}) {
            if((column.property === 'state' || column.property === 'lastComm') && row['state'] === 0) {
                return 'green'
            } else if((column.property === 'state' || column.property === 'lastComm') && row['state'] === 1) {
                return 'red'
            } else {
                return ''
            }
        },
        //删选
        filterTag: function(value,row,column) {
            if(column.property === 'unit')  return row.unit === value
            if(column.property === 'type')  {
                return row.type.indexOf(value) > -1
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .restmanage-container {

    }
</style>