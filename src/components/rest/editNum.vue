<template>
    <div>
        <my-dialog :title="title" :show="isShowEdit" :width="width" :confirmText="confirmText" @confirm="confirm" :isCancel="true"  @cancel="close"
                    :cancelText="cancelText" @close="close">
            <template slot="dialog-content">
                <my-form :formData="form" :formItem="formItem" :position="position" @changeSelect="changeSetType">
                    <template slot="numday">
                         <el-input-number v-model="form.numday" controls-position="right" :min="0" size="mini" style="width: 80px;margin:0 10px;"></el-input-number><span>天</span>
                    </template>
                </my-form>
            </template>
        </my-dialog>
    </div>
</template>

<script>
import MyDialog from '@/components/common/MyDialog'
import MyForm from '@/components/common/MyForm'
export default {
    props: {
        title: {type:String},
        isShowEdit: {type:Boolean},
        form: {type:Object},
        formItem: {type:Array},
    },
    data() {
        return {
            width: '800px',
            confirmText: '保存',
            cancelText: '取消',
            position: 'left',
        }
    },
    components: {MyDialog,MyForm},
    methods: {
        confirm:function() {
            this.$emit('confirm')
        },
        close:function() {
            this.$emit('close')
        },
        changeSetType:function() {
            this.$emit('changeSetType')
        },
    }
}
</script>

<style lang="scss" scoped>
    
</style>