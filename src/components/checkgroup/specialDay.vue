<template>
    <div class="specialday-container">
        <el-button size="mini" type="primary" @click.prevent="choose">{{buttonText}}</el-button>
        <span>{{tipText}}</span>
        <my-dialog :title="showLayer.title" :show.sync="showLayer.isShowEdit" :width="'50%'" @close="closeEdit" :center="true" :isConfirm="true" @confirm="confirm" :confirmText="showLayer.confirmText"
        :isCancel="true" :size="'mini'" @cancel="cancel">
            <my-form :formData="timeData" :formItem="formItem" slot="dialog-content" :size="'middle'" class="dateset"></my-form>
            <div class="check-count" slot="dialog-content" v-if="type === 1">
                <time-tag :time="timeTagData"></time-tag>
            </div>
        </my-dialog>
        <table-data :head="head[type]" :tableData="tableData" :isOption="true" :isPagination="false" :isSelected="false" v-if="timeTagData.length">
            <div class="option" slot="option">
                <span>编辑</span>|
                <span>删除</span>
            </div>
        </table-data>
    </div>
</template>

<script>
import MyDialog from '@/components/common/MyDialog'
import MyForm from '@/components/common/MyForm'
// import ClockCount from '@/components/checkgroup/clockCount'
import TimeTag from './timeTag'
import TableData from '@/components/common/TableData'
export default {
    props: {
        buttonText: {type:String,default: '选择'},
        tipText: {type: String},
        showLayer: {type: Object, default: function() {return {title: '',isShowEdit:false}}},
        timeData: {type: Object},
        type: {type:Number},
        timeTagData: {type: Array}
    },
    data() {
        return {
            formItem:[{prop: 'date',label: '日期',type:'date',placeholder:'请选择日期'}],
            head: {0:[{key: 'date',name: '日期'}],1:[{key:'date',name: '日期'},{key:'clockschedual',name: '考勤班次'}],2:[{key:'date',name: '日期'},{key:'clockschedual',name: '考勤班次'}]},
            tableData: []
        }
    },
    components: {
        MyDialog,MyForm,TimeTag,TableData
    },
    methods: {
        closeEdit: function() {
            this.showLayer.isShowEdit = false
        },
        confirm: function() {
            console.log(this.timeData);
            this.$emit('confirm',this.timeData)
        },
        choose: function() {
            this.$emit('choose')
        },
        cancel: function() {
            this.showLayer.isShowEdit = false
        }
    }
}
</script>


<style lang="scss" scoped>
.specialday-container {
    .el-button {
        margin-right: 10px;
    }
    span {
        color: #aaa;
    }
    .dateset {
        margin-bottom: 10px;
        /deep/ .el-form-item__label-wrap {
            margin-right: 60px;
        }
    }
    
}
</style>

