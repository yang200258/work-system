<template>
    <div class="restmanage-container">
        <table-data :isSelected="false" :head="restHead" :tableLoading="loading" :tableData="restData" :data="searchInfo" :formData="formData" @inputSearch="inputSearch"
            :mutiItem="mutiItem" :option="option" @createRest="createRest" @editRest="editRest" @optionRest="optionRest" :format="format" :cellClassName="statusName"
            :filterTag="filterTag" :columnKey="'unit'" :totalNumber="total" @currentChange="next">
            <template #special="{scope: scope}">
                <div class="type-wrapper" v-if="scope.column.property === 'userType'" >
                    <el-tag style="margin-right:8px;" v-for="item in scope.row.userType" :key="item" :type="status[item]">{{typeContent[item]}}</el-tag>
                    <span v-if="scope.column.property === 'userType' && !scope.row.userType.length">无</span>
                </div>
            </template>
        </table-data>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
import {mapMutations} from 'vuex'
export default {
    data() {
        return {
            restHead: [{key:'name',name:'假期名称'},{key:'applyUnit',name:'请假单位',filter:[]}, {key:'userType',name:'可用员工类型',filter:[]}, {key:'state',name:'状态'},{key:'rule',name:'余额规则'}],
            loading: false,
            restData:[],
            searchInfo:{},
            total: 0,
            formData: [{type:'input',placeholder:'输入名称搜索',label:'name',isSuffix: true}],
            mutiItem:{right:[{nameText:'新增',className:'el-icon-circle-plus-outline',event:'createRest'}]},
            option: [{name:'编辑',type:1,event:'editRest'},{name:'启用',type:1,event:'optionRest'},{name:'禁用',type:2,event:'optionRest'}],
            status: ['success','','info'],
            typeContent: ['正式','劳派','外包'],
        }
    },
    components: {TableData},
    mounted() {
        this.getRest()
    },
    computed: {
        
    },
    methods: {
        ...mapMutations({
            setRestForm: 'rest/setRestForm',
            initialRestForm: 'rest/initialRestForm',
        }),
        next: function(val) {
            this.search(this.searchInfo,val)
        },
        //获取假期列表
        getRest() {
            this.search(this.searchInfo)
            let filterList = this.restHead.filter(i => ['applyUnit','userType'].includes(i.key))
            const applyUnit = ['按小时请假','按工作日请假','按自然日请假']
            filterList.forEach(item=> {
                if(item.key === 'applyUnit') {
                    this.restData.forEach(t => {
                        item.filter.push({text:applyUnit[t.applyUnit],value:applyUnit[t.applyUnit]})
                    })
                    item.filter = this._.uniqBy(item.filter,'text')
                } else {
                    const names = ['正式员工','劳派员工','外包员工']
                    const types = this.restData.map(item=>item.userType).flat()
                    this._.uniq(types).forEach(m=> {
                        item.filter.push({text:names[m],value:m})
                    })
                }
            })
        },
        //按名称搜索假期
        inputSearch() {
            this.search(this.searchInfo)
        },
        async search(info,page=1,size=20) {
            let res = await this.$axios({url:`/es/holiday/_search?page=${page}&size=${size}`,method: 'post',data: info})
            this.restData = res.content
            this.total = res.recordCount
        },
        //创建假期
        createRest: function() {
            this.initialRestForm()
            this.$router.push({
                name: 'createRest'
            })
        },
        //编辑假期
        editRest: function(scope) {
            this.setRestForm(scope.row)
            this.$router.push({
                name:'createRest',
            })
        },
        //启用、禁用假期
        async optionRest(scope) {
            let res = await this.$axios({url:`/es/holiday/changeState?id=${scope.row.id}`,method:'post'})
            this.$message.success(res)
            this.getRest()
        },
        format: function(cellValue,propperty) {
            const applyUnit = ['按小时请假','按工作日请假','按自然日请假']
            switch(propperty) {
                case 'state':
                    return cellValue ? '禁用' : '启用'
                case 'applyUnit':
                    return  applyUnit[cellValue]
                default:
                    return cellValue && cellValue.length ? cellValue : '无'
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
        //筛选
        filterTag: function(value,row,column) {
            if(column.property === 'applyUnit')  return row.unit === value
            if(column.property === 'userType')  {
                return row.userType.includes(value)
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    .restmanage-container {

    }
</style>