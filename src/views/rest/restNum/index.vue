<template>
    <div class="restmanage-container">
        <table-data :isOption="false" :head="leaveHead" :tableLoading="loading" :tableData="leaveData" :data="searchInfo" :formData="formData" @btnClick="searchLeave"
            :mutiItem="mutiItem" @input="input" :format="format" :totalNumber="total" @currentChange="next" @mutiRestNum="mutiRestNum" @selectionChange="selectionChange">
            <template #special="{scope: scope}">
                <div class="restmanage-wrapper" v-if="scope.column.property === 'userType' || scope.column.property%1 === 0" >
                    <div class="restmanageType-wrapper" v-if="scope.column.property === 'userType'" >
                        <el-tag style="margin-right:8px;" type="success">{{scope.row.userType}}</el-tag>
                    </div>
                    <div v-else>
                        <span class="rest-num" @click.prevent="getRestInfo(scope)">{{scope.row[scope.column.property].balance}}</span>
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
            leaveHead: [{key:'userName',name:'姓名'},{key:'account',name:'账号',}, {key:'department',name:'部门'}, {key:'userType',name:'员工类型'}],
            loading: false,
            leaveData:[],
            searchInfo:{},
            total: 0,
            formData: [{type:'input',placeholder:'请输入姓名',label:'name'},{type:'selectTree',placeholder:'全部',nameText:'所属部门',label:'oid',tipText:'全部'},
                       {type:'mutiSelect',nameText:'显示假种',placeholder:'全部',label:'holidayId',options: []},
                       {type:'button',nameText: '搜索',btnType:'primary'}],
            mutiItem:{left: [{nameText:'批量调整额度',className:'el-icon-edit-outline',event:'mutiRestNum'}],right:[{nameText:'批量导入',className:'el-icon-download',event:'input'}]},
            isShowEdit: false,
            form: {numday:0},
            formItem:[{type:'select',prop:'holidayId',options:[],label:'修改年假'},
                {type:'select',prop:'adjust',options:[{id:1,name:'增加'},{id:-1,name:'减少'}],suffixSlotName:'numday',label:'修改年假'},
                        {type:'input',inputType:'textarea',placeholder:'请输入理由（必填）',rows:4,label:'理由',prop: 'reason'}],
        }
    },
    components: {TableData,EditNum},
    mounted() {
        this.getRestType().then(res=> {
            let index = this._.findIndex(this.formData,item => item.label == 'holidayId')
            let itemIndex = this._.findIndex(this.formItem,item => item.prop == 'holidayId')
            this.formData[index].options = this.formItem[itemIndex].options = res
        })
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
                this.formatSearchData(this.leaveData)
                this.loading = false
            } catch(err) {
                console.log(err)
                this.loading = false
            }
        },
        //格式化获取数据--添加假期数据
        formatSearchData(leaveData) {
            leaveData.forEach(item => {
                if(item.holidayBal.length === 0) return
                item.holidayBal.forEach(holiday =>{
                    item[holiday.holidayId] = holiday
                    if(this.leaveHead.find((item => item.key == holiday.holidayId))) return 
                    this.leaveHead.push({key:`${holiday.holidayId}`,name:`${holiday.holidayName}(${holiday.applyUnit})`})
                })
            })
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
            let userId = this.userId
            try {
                let res = await this.$axios({url: '/es/holidayBal/adjust',method:'post',data:{userId,adjust,holidayId,reason}})
                if(res) {
                    this.$message.success(res)
                    this.search(this.searchInfo)
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
            let userInfo = scope.row
            let clickInfo = scope.row[scope.column.property]
            this.$router.push({
                name: 'restInfo',
                params: {userInfo,clickInfo}
            })
        },
        format: function(cellValue,propperty) {
            switch(propperty) {
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