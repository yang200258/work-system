<template>
    <div class="dialog-container">
        <el-dialog :title="title" :visible.sync="visible" :width="width" :center="center" @close="close" :show="show">
            <slot name="dialog-content"></slot>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="isCancel" @click="cancel">{{cancelText}}</el-button>
                <el-button v-if="isConfirm" type="primary" @click="confirm">{{confirmText}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        title: {type:String,default:''},
        show: {type:Boolean,default:false},
        width: {type:String,default:'50%'},
        center: {type:Boolean,default: false},
        isCancel: {type: Boolean,default: false},
        isConfirm: {type: Boolean,default: true},
        cancelText: {type: String,default: '取消'},
        confirmText: {type: String,default: '保存'},
    },
    data() {
        return {
            visible: this.show
        }
    },
    watch: {
       show() {
           this.visible = this.show
       }
    },
    methods: {
        cancel: function() {
            this.$emit('cancel')
        },
        confirm: function() {
            this.$emit('confirm')
        },
        close: function() {
            this.$emit('close',false)
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>