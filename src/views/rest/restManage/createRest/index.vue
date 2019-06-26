<template>
    <div class="createrest-container">
        <my-form :formData="restForm" :formItem="formItem">
            <template slot="blance">
                <my-form :formData="blanceForm" :formItem="blanceItem">
                    <template slot="delayNum">
                        超过有效期<el-input-number v-model="delayNum" controls-position="right" :min="1"></el-input-number>天仍可使用
                    </template>
                </my-form>
            </template>
        </my-form>
    </div>
</template>


<script>
import MyForm from '@/components/common/MyForm'
export default {
    data() {
        return {
            //假期数据
            restForm:{employType:[]},
            //余额数据
            blanceForm: {},
            // 假期项
            formItem: [{type:'input',prop:'name',placeholder:'请输入假期名称',label:'假期名称'},
                        {type:'select',prop:'timeType',placeholder:'请选择',options:[{id:0,name:'按工作日'},{id:1,name:'按自然日'},{id:2,name:'按小时'}],label:'时间单位'},
                        {type:'input',prop:'tip',inputType:'textarea',placeholder:'请输入提示文案',label:'提示文案（可选）',rows:6},
                        {type:'check',prop:'employType',options:[{name:'正式员工',value:0},{name:'劳务派遣',value:1},{name:'外包员工',value:2}],label:'可用员工类型'},
                        {type:'switch',prop:'isBlance',label:'启用余额',slotName:'blance'}],
            //余额项
            blanceItem: [{type:'select',prop:'blanceType',placeholder:'请选择',options:[{id:0,name:'按年发放（每年1月1日发放额度）'},{id:1,name:'按月发放（每月1日发放额度）'},
                            {id:2,name:'按加班工时发放（根据系统记录加班工时自动计算）'},{id:3,name:'手动发放'}],label:'余额发放方式'},{type:'inputNumber',label:'发放额度',min:0},
                            {type:'input',prop:'blanceRule',label:'额度转换规则'},
                            {type:'select',prop:'rule',placeholder:'请选择',options:[{id:0,name:'按自然年（1月1日-12月31日）'},{id:1,name:'按自然月（每月1日-当月月底）'}],label:'有效期规则'},
                            {type:'checkbox',prop:'delay',checkBoxName:'是否延长有效期',slotName:'delayNum'}],
            delayNum: 0
        }
    },
    components: {MyForm}
}
</script>

<style lang="scss" scoped>
    .createrest-container {

    }
</style>
