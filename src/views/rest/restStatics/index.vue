<template>
    <div class="restmanage-container">
        <table-data :isSelected="false" :isOption="false" :head="leaveHead" :tableLoading="loading" :tableData="leaveData" :data="searchInfo" :formData="formData" @btnClick="searchLeave"
            :mutiItem="mutiItem" @output="output" :format="format" :totalNumber="total" @currentChange="next">
            <template #special="{scope: scope}">
                <div class="restmanage-wrapper" v-if="scope.column.property === 'userType' || times.includes(scope.column.property)">
                    <div class="restmanageType-wrapper" v-if="scope.column.property === 'userType'" >
                        <el-tag style="margin-right:8px;" v-for="item in scope.row.userType" :key="item" :type="status[item]">{{typeContent[item]}}</el-tag>
                        <span v-if="scope.column.property === 'userType' && !scope.row.userType.length">无</span>
                    </div>
                    <div v-if="times.includes(scope.column.property)">
                        <span class="rest-num" @click.prevent="getRestInfo(scope)">{{scope.row[scope.column.property]}}</span>
                    </div>
                </div>
            </template>
        </table-data>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
import {mapState,mapActions} from 'vuex'
export default {
    data() {
        return {
            leaveHead: [{key:'name',name:'姓名',fixed:true,width:100},{key:'account',name:'账号',fixed:true,width:100}, {key:'depart',name:'部门',fixed:true,width:100}, 
                    {key:'userType',name:'员工类型',fixed:true,width:200},{key:'year',name:'年假（天）',sortable:true},
                        {key:'hour',name:'免责事假（小时）',sortable:true},{key:'day',name:'探父母假（天）',sortable:true},{key:'day',name:'探父母假（天）',sortable:true}
                        ,{key:'day',name:'探父母假（天）',sortable:true},{key:'day',name:'探父母假（天）',sortable:true},{key:'day',name:'探父母假（天）',sortable:true}
                        ,{key:'day',name:'探父母假（天）',sortable:true},{key:'day',name:'探父母假（天）',sortable:true},{key:'day',name:'探父母假（天）',sortable:true}
                        ,{key:'day',name:'探父母假（天）',sortable:true},{key:'day',name:'探父母假（天）',sortable:true},{key:'day',name:'探父母假（天）',sortable:true}
                        ,{key:'day',name:'探父母假（天）',sortable:true},{key:'day',name:'探父母假（天）',sortable:true},{key:'day',name:'探父母假（天）',sortable:true}
                        ,{key:'day',name:'探父母假（天）',sortable:true},{key:'day',name:'探父母假（天）',sortable:true},{key:'day',name:'探父母假（天）',sortable:true}],
            loading: false,
            leaveData:[],
            searchInfo:{},
            total: 0,
            formData: [{type:'input',placeholder:'请输入姓名',label:'name'},{type:'selectTree',placeholder:'全部',nameText:'所属部门',label:'depart',tipText:'全部'},
                        {type:'date',dateType:'daterange',label:'date',startPlaceholder:'开始日期',endPlaceholder:'结束日期',valueFormat:'yyyy-MM-dd'},
                       {type:'mutiSelect',nameText:'显示假种',placeholder:'全部',label:'leaveType',options: []},
                       {type:'button',nameText: '搜索',btnType:'primary'}],
            mutiItem:{right:[{nameText:'导出',className:'el-icon-download',event:'output'}]},
            status: ['success','','info'],
            typeContent: ['正式','劳派','外包'],
            leaveType:['年休假','探亲假','免责事假'],
            times: ['year','hour','day']
        }
    },
    components: {TableData},
    mounted() {
        this.getRestType().then(res=> this.formData[3].options = res)
        this.search(this.searchInfo)
    },
    computed: {
        ...mapState({
            restType: state => state.restType
        })
    },
    methods: {
        ...mapActions({
            getRestType: 'rest/getRestType'
        }),
        next: function(val) {
            this.search(this.searchInfo,val)
        },
        //获取假期列表
        // getLeaveData() {
        //     this.search(this.searchInfo)
        //     // let filterList = this.leaveHead.filter(i => ['depart'].includes(i.key))
        //     // filterList.forEach(item=> {
        //     //     if(item.key === 'depart') {
        //     //         this.leaveData.forEach(t => {
        //     //             item.filter.push({text:t.depart,value:t.depart})
        //     //         })
        //     //         item.filter = this._.uniqBy(item.filter,'text')
        //     //     }
        //     // })
        // },
        //筛选
        searchLeave: function() {
            this.search(this.searchInfo)
        },
        //筛选封装函数
        // eslint-disable-next-line
        async search(info,page=1,size=20) {
            this.loading = true
            // let res = await this.$axios({url:`/es/holiday/_search?page=${page}&size=${size}`,method: 'post',data: info})
            let res = {content:[{name:'一起去',account:'uchgdui',depart:'A',userType:[0,1,2],year:6,hour:8,day:6},
                        {name:'yqq',account:'uchcdvvgdui',depart:'BX',userType:[0,1],year:6,hour:8,day:6}],recordCount:3}
            this.loading = false
            this.leaveData = res.content
            this.total = res.recordCount
        },
        //导出
        output: function() {
            
        },
        //点击假数进入假期额度详情
        getRestInfo: function() {
            this.$router.push({
                name:'restInfo'
            })
        },
        format: function(cellValue,propperty) {
            switch(propperty) {
                case 'leaveType':
                    return  this.leaveType[cellValue]
                default:
                    return cellValue ? cellValue : '无'
            }
        },
        //筛选
        // filterTag: function(value,row,column) {
        //     if(column.property === 'depart')  return row.depart === value
        // },
    }
}
</script>

<style lang="scss" scoped>
    .restmanage-container {
        width: 100%;
        .rest-num {
            color:#0096FF;
            text-decoration: underline;
            &:hover {
                cursor: pointer;
            }
        }
    }
</style>