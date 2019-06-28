<template>
    <div class="restinfo-container">
        <div class="restinfo-header">
            <div class="header-info">
                <div class="left-header-info">
                    {{name}}
                </div>
                <div class="right-header-info">
                    <div><span>{{name}}</span><span>的额度使用记录</span> </div>
                    <div><span>部门：</span><span>{{depart}}</span> </div>
                </div>
            </div>
            <div class="header-balance">
                <el-select v-model="restType" size="mini" @change="changeSelect">
                    <el-option v-for="(option,i) in options" :key="i" :label="option.name" :value="option.value"></el-option>
                </el-select>
                <span>额度：</span><span class="num" @click.prevent="showSetBalance">{{num}}</span><span>天（年假规则：</span><span>{{rule}}）</span>
            </div>
            <div class="header-option">
                <el-button type="primary" size="mini" @click.prevent="showSetBalance">调整额度</el-button>
            </div>
        </div>
        <table-data :isOption="false" :head="infoHead" :tableLoading="loading" :tableData="infoData" :totalNumber="total" :currentChange="next" ></table-data>
        <my-dialog :title="'修改额度'" :show="isShowEdit" :width="'800px'" :confirmText="'保存'" @confirm="confirm" :isCancel="true"  @cancel="close"
                    :cancelText="'取消'" @close="close">
            <template slot="dialog-content">
                <my-form :formData="form" :formItem="formItem" :position="'left'" @changeSelect="changeSelect">
                    <template slot="numday">
                         <el-input-number v-model="numday" controls-position="right" :min="0" size="mini" style="width: 80px;margin:0 10px;"></el-input-number><span>天</span>
                    </template>
                </my-form>
            </template>
        </my-dialog>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
import MyDialog from '@/components/common/MyDialog'
import MyForm from '@/components/common/MyForm'
export default {
    data() {
        return {
            infoHead:[{key:'date',name:'时间'},{key:'operator',name:'操作人'},{key:'option',name:'操作'},{key:'balance',name:'额度'},{key:'validity',name:'有效期'},{key:'reason',name:'理由'}
                ,{key:'last',name:'操作后余额'}],
            infoData: [],
            loading:false,
            total: 0,
            options:[{value: 0,name:'年假'}],
            restType: 0,
            num: 5,
            rule: '每年1月1日自动发放5天',
            name: '刘鑫',
            depart: '产品中心',
            isShowEdit: false,
            form:{},
            numday: 0,
            formItem:[{type:'select',prop:'type',options:[{id:0,name:'增加'},{id:1,name:'减少'}],suffixSlotName:'numday',label:'修改年假'},
                        {type:'input',inputType:'textarea',placeholder:'请输入理由（必填）',rows:4,label:'理由'}]
        }
    },
    components: {TableData,MyDialog,MyForm},
    methods: {
        //翻页
        next: function() {

        },
        //显示调整额度弹窗
        showSetBalance: function() {
            this.isShowEdit = true
        },
        //改变假种时触发
        changeSelect: function() {

        },
        //调整额度
        confirm: function() {

        },
        close: function() {
            this.isShowEdit = false
        }
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
                cursor:pointer
            }
        }
        .header-option {

        }
    }
}
</style>
