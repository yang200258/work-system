<template>
    <div class="device-manage">
        <section class="device-content">
            <table-data :head="table.head" :isSelected="false" :tableData="table.content" :tableLoading="table.loading" :option="option" :totalNumber="table.total" @currentChange="currentChange" @chooseTable="chooseTable"
            @editTable="editTable" @delTable="delTable" :data="searchInfo" :formData="formitem" @btnClick="searchDevice" :mutiItem="mutiItem" @addDevice="addDevice" @runRecord="runRecord"
            ></table-data>
        </section>
        <section class="device-info">
            <my-dialog :title="infoSet.title" :show="isShowInfo" :width="infoSet.width" :confirmText="infoSet.confirmText" @confirm="confirm" :isCancel="infoSet.isCancel"  @cancel="cancel"
                    :cancelText="infoSet.cancelText" @close="close">
                <template slot="dialog-content">
                    <my-form :formData="form" :formItem="formItem" ref="editForm" :position="'right'" class="form" :read="read"></my-form>
                </template>
            </my-dialog>
        </section>
    </div>
</template>
<script>
import TableData from '@/components/common/TableData'
import MyDialog from '@/components/common/MyDialog'
import MyForm from '@/components/common/MyForm'
export default {
    props: {
        table: {type: Object},
        searchInfo: {type: Object},
        infoSet: {type: Object},
        formItem: {type: Array},
        form: {type:Object},
        isShowInfo: {type:Boolean,default: false},
        mutiItem: {type:Object,default: ()=> {}}
    },
    data() {
        return {
            option:[{name: '查看',type:1,event: 'chooseTable'},{name: '编辑',type:1,event: 'editTable'},{name:'停用',type:2,event: 'delTable'}],
            formitem: [{type:'input',label:'name',placeholder:'设备编号'},{type:'checkbox',label:'showAbnormal',nameText:'只显示通信异常设备（最近5天没有通信）'},
                    {type:'button',btnType:'primary',nameText:'搜索'}],
            read: true,
        }
    },
    components: {
        TableData,
        MyDialog,
        MyForm
        },
    methods: {
        searchDevice: function() {
            this.$emit('searchDevice')
        },
        currentChange: function(val) {
            this.$emit('currentChange',val)
        },
        delTable: function(scope) {
            this.$emit('delTable',scope)
        },
        editTable: function(scope) {
            this.read = false
            this.$emit('editTable',scope)
        },
        chooseTable: function(scope) {
            this.read = true
            this.$emit('chooseTable',scope)
        },
        confirm: function() {
            this.$emit('confirm')
        },
        cancel: function() {
            this.$emit('cancel')
        },
        close: function() {
            this.$emit('close')
        },
        addDevice: function() {
            this.read = false
            this.$emit('addDevice')
        },
        runRecord: function() {
            this.$emit('runRecord')
        }
    }
}
</script>

<style lang="scss" scoped>
    .device-manage {
        // margin: 20px 40px;
        .device-info {
            .form {
                /deep/ .el-form-item {
                    margin-bottom: 0;
                    display: flex;
                }
            }
        }
    }
</style>

