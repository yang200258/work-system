<template>
    <div class="specialday-container">
        <el-button size="mini" type="primary" @click.prevent="choose">{{buttonText}}</el-button>
        <span>{{tipText}}</span>
        <my-dialog :title="showLayer.title" :show.sync="showLayer.isShowEdit" :width="'30%'" @close="closeEdit" :center="true" :isConfirm="true" @confirm="confirm" :confirmText="showLayer.confirmText"
        :isCancel="true" :size="'mini'" @cancel="cancel">
            <my-form :formData="timeData" :formItem="formItem" slot="dialog-content" :size="'middle'" class="dateset"> </my-form>
            <time-tag  slot="dialog-content" v-if="type === 0" :time="timeData.time"></time-tag>
        </my-dialog>
    </div>
</template>

<script>
import MyDialog from '@/components/common/MyDialog'
import MyForm from '@/components/common/MyForm'
import TimeTag from '@/components/checkgroup/timeTag'
export default {
    props: {
        buttonText: {type:String,default: '选择'},
        tipText: {type: String},
        showLayer: {type: Object, default: function() {return {title: '',isShowEdit:false}}},
        timeData: {type: Object},
        type: {type:Number},
    },
    data() {
        return {
            formItem:[{prop: 'date',label: '日期',type:'date',placeholder:'请选择日期'}]
        }
    },
    components: {
        MyDialog,MyForm,TimeTag
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

