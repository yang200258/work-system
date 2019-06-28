<template>
    <div class="restmanage-container">
        <table-data :isSelected="false" :isOption="false" :head="leaveHead" :tableLoading="loading" :tableData="leaveData" :data="searchInfo" :formData="formData" @btnClick="searchLeave"
            :mutiItem="mutiItem" @output="output" :format="format" :totalNumber="total" @currentChange="next">
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
export default {
    data() {
        return {
            leaveHead: [{key:'name',name:'姓名'},{key:'account',name:'账号',}, {key:'depart',name:'部门'}, {key:'userType',name:'员工类型'},{key:'date',name:'日期',sortable: true}
                        ,{key:'week',name:'星期'},{key:'leaveType',name:'假种',sortable: true},{key:'time',name:'时长'},{key:'man',name:'审批人'}],
            loading: false,
            leaveData:[],
            searchInfo:{},
            total: 0,
            formData: [{type:'input',placeholder:'请输入姓名',label:'name'},{type:'selectTree',placeholder:'全部',nameText:'所属部门',label:'depart',tipText:'全部'},
                        {type:'date',dateType:'daterange',label:'date',startPlaceholder:'开始日期',endPlaceholder:'结束日期',valueFormat:'yyyy-MM-dd'},
                       {type:'mutiSelect',nameText:'显示假种',placeholder:'全部',label:'leaveType',options: []},
                       {type:'button',nameText: '筛选',btnType:'primary'}],
            mutiItem:{right:[{nameText:'导出',className:'el-icon-download',event:'output'}]},
            status: ['success','','info'],
            typeContent: ['正式','劳派','外包'],
            leaveType:['年休假','探亲假','免责事假'],
        }
    },
    components: {TableData},
    mounted() {
        //获取假种
        this.getRestType()
        this.search(this.searchInfo)
    },
    methods: {
        //请求假期类型接口
        async getRestType() {
            // let res = await this.$axios({url:'****',method:'post'})
            let res = [{name:'年休假',id: 0},{name:'探亲假',id: 1},{name:'免责事假',id: 2}]
            this.formData[3].options = res
        },
        next: function(val) {
            this.search(this.searchInfo,val)
        },
        //筛选
        searchLeave: function() {
            this.search(this.searchInfo)
        },
        //筛选封装函数
        // eslint-disable-next-line
        async search(info,page=1,size=20) {
            this.loading = true
            // let res = await this.$axios({url:`/es/holiday/_search?page=${page}&size=${size}`,method: 'post',data: info})
            let res = {content:[{name:'一起去',account:'uchgdui',depart:'A',userType:[0,1,2],date:'2018-09-09',week:'星期四',leaveType:0,time:'1天',man:'哈哈哈'},
                        {name:'yqq',account:'uchcdvvgdui',depart:'BX',userType:[0,1],date:'2018-09-09',week:'星期四',leaveType:2,time:'1天',man:'哈哈哈'}],recordCount:3}
            this.loading = false
            this.leaveData = res.content
            this.total = res.recordCount
        },
        //导出
        output: function() {
            
        },
        format: function(cellValue,propperty) {
            switch(propperty) {
                case 'leaveType':
                    return  this.leaveType[cellValue]
                default:
                    return cellValue && cellValue.length ? cellValue : '无'
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    .restmanage-container {

    }
</style>