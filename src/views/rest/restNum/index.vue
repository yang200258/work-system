<template>
    <div class="restmanage-container">
        <table-data :isOption="false" :head="leaveHead" :tableLoading="loading" :tableData="leaveData" :data="searchInfo" :formData="formData" @btnClick="searchLeave"
            :mutiItem="mutiItem" @input="input" :format="format" :totalNumber="total" @currentChange="next" @mutiRestNum="mutiRestNum" @selectionChange="selectionChange">
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
        <edit-num :title="'批量修改额度'" :isShowEdit="isShowEdit" :form="form" :formItem="formItem" @confirm="confirm"  @cancel="close" @close="close"></edit-num>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
import EditNum from '@/components/rest/editNum'
import {mapState,mapActions} from 'vuex'
export default {
    data() {
        return {
            leaveHead: [{key:'name',name:'姓名'},{key:'account',name:'账号',}, {key:'depart',name:'部门'}, {key:'userType',name:'员工类型'},{key:'year',name:'剩余年假（天）',sortable:true},
                        {key:'hour',name:'剩余免责事假（小时）',sortable:true},{key:'day',name:'剩余探父母假（天）',sortable:true}],
            loading: false,
            leaveData:[],
            searchInfo:{},
            total: 0,
            formData: [{type:'input',placeholder:'请输入姓名',label:'name'},{type:'selectTree',placeholder:'全部',nameText:'所属部门',label:'oid',tipText:'全部'},
                       {type:'mutiSelect',nameText:'显示假种',placeholder:'全部',label:'holidayId',options: []},
                       {type:'button',nameText: '搜索',btnType:'primary'}],
            mutiItem:{left: [{nameText:'批量调整额度',className:'el-icon-edit-outline',event:'mutiRestNum'}],right:[{nameText:'批量导入',className:'el-icon-download',event:'input'}]},
            status: ['success','','info'],
            typeContent: ['正式','劳派','外包'],
            leaveType:['年休假','探亲假','免责事假'],
            times: ['year','hour','day'],
            isShowEdit: false,
            form: {numday:0},
            formItem:[{type:'select',prop:'holidayId',options:[],label:'修改年假'},
                {type:'select',prop:'adjust',options:[{id:1,name:'增加'},{id:-1,name:'减少'}],suffixSlotName:'numday',label:'修改年假'},
                        {type:'input',inputType:'textarea',placeholder:'请输入理由（必填）',rows:4,label:'理由',prop: 'reason'}],
        }
    },
    components: {TableData,EditNum},
    mounted() {
        this.getRestType().then(res=> this.formData[2].options = this.formItem[0].options = res)
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
        //搜索
        searchLeave: function() {
            this.search(this.searchInfo)
        },
        //筛选封装函数
        // eslint-disable-next-line
        async search(info,page=1,size=20) {
            this.loading = true
            try {
                let res = await this.$axios({url:`/es/holidayBal/_search?page=${page}&size=${size}`,method: 'post',data: info})
                this.leaveData = res.content
                this.total = res.recordCount
                this.loading = false
            } catch(err) {
                console.log(err)
                this.loading = false
            }
            
        },
        //批量导入
        input: function() {
           this.$router.push({
               name: 'restInput'
           }) 
        },
        //显示批量调整额度界面
        mutiRestNum: function() {
            this.form = {numday:0}
            this.isShowEdit = true
        },
        selectionChange: function(val) {
            this.userId = val.map(item => item.userId)
            console.log(this.userId)
        },
        //调整额度
        async confirm() {
            let {adjust,reason,numday,holidayId} = this.form
            adjust = adjust * numday
            try {
                let res = await this.$axios({url: '/es/holidayBal/adjust',method:'post',data:{adjust,holidayId,reason}})
                if(res) {
                    this.$message.success(res)
                    this.isShowEdit = false
                }
            } catch(err) {
                this.$meaasge.error(err)
            }
        },
        close: function() {
            this.isShowEdit = false
        },
        //点击假数进入假期额度详情
        getRestInfo: function(scope) {
            this.$router.push({
                name: 'restInfo',
                params: {userInfo:scope.row}
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
    }
}
</script>

<style lang="scss" scoped>
    .restmanage-container {
        .rest-num {
            color:#0096FF;
            text-decoration: underline;
            &:hover {
                cursor: pointer;
            }
        }
    }
</style>