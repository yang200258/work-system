<template>
    <div class="restinfo-container">
        <div class="restinfo-header">
            <div class="header-info">
                <div class="left-header-info">
                    {{userInfo.userName}}
                </div>
                <div class="right-header-info">
                    <div><span>{{userInfo.userName}}</span><span>的额度使用记录</span> </div>
                    <div><span>部门：</span><span>{{userInfo.department}}</span> </div>
                </div>
            </div>
            <div class="header-balance">
                <el-select v-model="userInfo.holidayId" size="mini" @change="changeSelect">
                    <el-option v-for="(option,i) in restType" :key="i" :label="option.name" :value="option.id"></el-option>
                </el-select>
                <span>额度：</span><span class="num" @click.prevent="showSetBalance">{{clickInfo.balance}}</span><span>天（年假规则：</span><span>{{clickInfo.rule}}）</span>
            </div>
            <div class="header-option">
                <el-button type="primary" size="mini" @click.prevent="showSetBalance">调整额度</el-button>
            </div>
        </div>
        <table-data :isSelected="false" :isOption="false" :head="infoHead" :tableLoading="loading" :tableData="infoData" :totalNumber="total" :currentChange="next" :format="format"></table-data>
        <edit-num :title="'修改额度'" :isShowEdit="isShowEdit" :form="form"  :formItem="formItem" @confirm="confirm"  @cancel="close" @close="close"></edit-num>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
import EditNum from '@/components/rest/editNum'
import {mapState} from 'vuex'
export default {
    data() {
        return {
            infoHead:[{key:'time',name:'时间',sortable:true},{key:'operator',name:'操作人'},{key:'action',name:'操作'},{key:'quota',name:'额度'},{key:'expire_at',name:'有效期'},{key:'reason',name:'理由'}
                ,{key:'balance',name:'操作后余额'}],
            infoData: [],
            loading:false,
            total: 0,
            options:[],
            isShowEdit: false,
            form:{numday:0},
            userInfo: {},
            clickInfo:{},
            formItem:[{type:'select',prop:'adjust',options:[{id:1,name:'增加'},{id:-1,name:'减少'}],suffixSlotName:'numday',label:'修改年假'},
                        {type:'input',inputType:'textarea',placeholder:'请输入理由（必填）',rows:4,label:'理由',prop: 'reason'}],
        }
    },
    components: {TableData,EditNum},
    computed: {
        ...mapState({
            restType:state => state.rest.restType
        })
    },
    mounted() {
        if(this.$route.params.userInfo) {
            this.userInfo = this.$route.params.userInfo
            this.clickInfo = this.$route.params.clickInfo
            this.userInfo.holidayId = this.clickInfo.holidayId
            this.getRestInfoList(this.userInfo.userId,this.userInfo.holidayId)
        }
    },
    methods: {
        //获取用户请假额度使用记录
        async getRestInfoList(userId,holidayId,page=1,size=20) {
            try {
                this.loading = true
                let res = await this.$axios({url:`/es/holidayBal/holidayLog?$page=${page}&size=${size}`,method: 'post',data:{userId,holidayId}})
                this.infoData = res.content
                this.total = res.recordContent
                this.loading = false
            } catch(err) {
                this.loading = false
                this.$message.error(err)
            }
        },
        //翻页
        next: function(val) {
            this.getRestInfoList(this.userInfo.userId,this.userInfo.holidayId,val)
        },
        //显示调整额度弹窗
        showSetBalance: function() {
            this.form = {numday:0}
            this.isShowEdit = true
        },
        //改变假种时触发
        changeSelect: function(val) {
            this.userInfo.holidayId = val
            this.getRestInfoList(this.userInfo.userId,val)
        },
        //调整额度
        async confirm() {
            let {adjust,reason,numday} = this.form
            let {holidayId,userId} = this.userInfo
            adjust = adjust * numday
            try {
                let res = await this.$axios({url: '/es/holidayBal/adjust',method:'post',data:{adjust,holidayId,reason,userId:[userId]}})
                if(res) {
                    if(!res.failCount) {
                        this.$message.success(`批量操作假期成功！`)
                    } else {
                        this.$message.success(`批量操作假期成功${res.success}人，失败${res.failCount}人，失败原因：${res.adjustFail}！`)
                    }
                    this.getRestInfoList(this.userInfo.userId,this.userInfo.holidayId)
                    this.isShowEdit = false
                }
            } catch(err) {
                this.$meaasge.error(err)
            }
        },
        close: function() {
            this.isShowEdit = false
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
.restinfo-container {
    display: flex;
    flex-direction: column;
    .restinfo-header {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #606266;
        padding: 0 32px;
        .header-info {
            display: flex;
            align-items: center;
            margin-right: 40px;
            .left-header-info {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: #409EFF;
                color: #000;
                text-align: center;
                line-height: 50px;
                margin-right: 10px;
            }
            .right-header-info {
                display: flex;
                flex-direction: column;
                height: 50px;
                justify-content: space-around;
            }
        }
        .header-balance {
            margin-right: 40px;
            .el-select {
                margin-right: 10px;
            }
            .num {
                color:#499EFF;
                text-decoration:underline;
                font-size:24px;
                cursor:pointer;
                display: inline-block;
                padding-right: 10px;
            }
        }
        
    }
}
</style>
