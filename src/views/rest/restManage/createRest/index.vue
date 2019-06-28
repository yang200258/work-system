<template>
    <div class="createrest-container">
        <my-form :formData="restForm" :formItem="formItem" @switchChange="isOpenBlance" @changeSelect="changeBlaanceType" @changeCheck="showDelayNum" class="form"
            :labelWidth="'180px'" :position="'left'">
            <template slot="blanceRule">
                <span>加班工时<i style="font-weight:700" class="el-icon-right"></i>1 调休日(可申请额度）</span>
            </template>
            <template slot="delayPre">
                <span style="font-size:12px;color:#606266;margin-right:6px;">超过有效期</span>
            </template>
            <template slot="delaySuffix">
                <span style="font-size:12px;color:#606266;margin-left:6px;">天仍可使用</span>
            </template>
        </my-form>
        <div class="btn"><el-button type="primary" @click.prevent="save">保存</el-button></div>
    </div>
</template>


<script>
import MyForm from '@/components/common/MyForm'
import {mapState,mapMutations} from 'vuex'
export default {
    data() {
        return {
            //假期数据
            // restForm:{userType:[],blanceType:0,limit:0,validityRule:0},
            // 假期项
            formItem: [{type:'input',prop:'name',placeholder:'请输入假期名称',label:'假期名称'},
                        {type:'select',prop:'applyUnit',placeholder:'请选择',options:[{id:0,name:'按工作日'},{id:1,name:'按自然日'},{id:2,name:'按小时'}],label:'时间单位'},
                        {type:'input',prop:'memo',inputType:'textarea',placeholder:'请输入提示文案',label:'提示文案（可选）',rows:6},
                        {type:'check',prop:'userType',options:[{name:'正式员工',value:0},{name:'劳务派遣',value:1},{name:'外包员工',value:2}],label:'可用员工类型'},
                        {type:'switch',prop:'balanceEnabled',label:'启用余额'},
                        // 余额
                        {type:'select',prop:'blanceType',placeholder:'请选择',options:[{id:0,name:'按年发放（每年1月1日发放额度）'},{id:1,name:'按月发放（每月1日发放额度）'},
                        {id:2,name:'按加班工时发放（根据系统记录加班工时自动计算）'},{id:3,name:'手动发放'}],label:'余额发放方式',hide:true},
                        {type:'inputNumber',label:'发放额度',min:0,prop:'limit',hide:true},
                        {type:'input',prop:'blanceRule',label:'额度转换规则',hide:true,suffixSlotName:'blanceRule',className:'blance-rule'},
                        {type:'select',prop:'validityRule',placeholder:'请选择',options:[{id:0,name:'按自然年（1月1日-12月31日）'},{id:1,name:'按自然月（每月1日-当月月底）'}],label:'有效期规则',hide:true},
                        {type:'checkbox',prop:'delay',checkBoxName:'是否延长有效期',hide:true},
                        {type:'inputNumber',label:'',controlsPosition:'right',min:0,prop:'delayNum',hide:true,suffixSlotName:'delaySuffix',preSlotName:'delayPre'}],
        }
    },
    components: {MyForm},
    computed: {
        ...mapState({
            restForm: state => state.rest.restForm
        })
    },
    methods: {
        ...mapMutations({
            initialRestForm: 'rest/initialRestForm'
        }),
        //启动余额开关显示项
        isOpenBlance: function(val) {
            const showList = ['blanceType','limit','validityRule','delay']
            const hideList = []
            if(val) {
                this.dealList(this.formItem,showList,hideList)
             } else {
                 showList.push('delayNum','blanceRule')
                 this.dealList(this.formItem,hideList,showList)
                //  this.initialRestForm
             } 
        },
        //根据额度发放方式选择显示项目
        changeBlaanceType: function(val,prop) {
            if(prop !== 'blanceType') return 
            if(val === 0 || val === 1) {
                const showList = ['limit']
                const hideList = ['blanceRule']
                this.dealList(this.formItem,showList,hideList)
            } else if(val === 2) {
                const showList = ['blanceRule']
                const hideList = ['limit']
                this.dealList(this.formItem,showList,hideList)
            } else if(val === 3) {
                const hideList = ['limit','blanceRule']
                this.dealList(this.formItem,[],hideList)
            }
        },
        dealList: function(arr,showList=[],hideList=[]) {
            arr.forEach(item=> {
                if(showList.includes(item.prop)) item.hide=false
                if(hideList.includes(item.prop)) item.hide=true
            })
        },
        //点击延长有效期显示项目
        showDelayNum: function(val) {
            this.formItem.forEach(item=> {
                if(item.prop === 'delayNum') item.hide = !val
            })
        },
        async save(){
            // eslint-disable-next-line
            let {code,config,...restForm} = this.restForm
            let data = restForm.id ? restForm : Object.assign({},restForm,{id:0})
            let res = await this.$axios({url:'/es/holiday/save',method:'post',data:data})
            this.$message.success(res)
            this.$router.push({name:'restManage'})
            
        }
    }
}
</script>

<style lang="scss" scoped>
    .createrest-container {
        padding: 30px 50px 0 50px;
        .btn {
            margin: 100px 0 0 500px;
        }
        .form {
            /deep/ .el-form-item {
                /deep/ .el-form-item__content {
                    width: 600px;
                    span {
                        font-size: 12px;
                        color: #606266;
                        display: block;
                        white-space: nowrap;
                    }
                    //调整长度
                    .blance-rule {
                        width: 60px;
                        margin-right: 6px;
                    }
                }
            }
        }
    }
</style>
