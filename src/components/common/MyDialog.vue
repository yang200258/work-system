<template>
    <div class="dialog-container">
        <el-dialog :title="title" :visible.sync="visible" :width="width" :center="center" @close="close" :show="show" custom-class="mydialog">
            <slot name="dialog-content"></slot>
            <el-dialog :width="width" :title="innerTitle" :visible.sync="innerVisible" :innerShow="innerShow" @close="closeInner" append-to-body>
                <slot name="innerDialog-content"></slot>
            </el-dialog>
            <span slot="footer" class="dialog-footer" v-if="isOption">
                <el-button :size="size" v-if="isCancel" @click="cancel">{{cancelText}}</el-button>
                <el-button :size="size" v-if="isConfirm" type="primary" @click="confirm">{{confirmText}}</el-button>
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
        center: {type:Boolean,default: true},
        isCancel: {type: Boolean,default: false},
        cancelText: {type: String,default: '取消'},
        isConfirm: {type: Boolean,default: true},
        confirmText: {type: String,default: '保存'},
        size: {type:String,default: 'small'},
        isOption: {type:Boolean,default: true},
        innerTitle:{type: String},
        innerShow: {type:Boolean}
    },
    data() {
        return {
            visible: this.show,
            innerVisible: this.innerShow
        }
    },
    watch: {
       show() {
           this.visible = this.show
       },
       innerShow() {
           this.innerVisible = this.innerShow
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
        },
        closeInner: function() {
            this.$emit('closeInner',false)
        }
    }
}
</script>

<style lang="scss" scoped>
    .dialog-container {
        /deep/ .el-dialog__wrapper {
            .el-dialog__header {
                border-bottom: 1px solid #EBEBF2;
            }
            .el-dialog__headerbtn {
                position: absolute;
                top: -14px;
                right: -30px;
                .el-icon-close {
                    color: #fff;
                    font-size: 22px;
                }
            }
            .el-dialog__body {
                padding: 30px 50px 50px 40px;
            }
            .el-dialog__footer {
                .dialog-footer {
                    width: 150px;
                    display: block;
                    margin:0 auto;
                    display: flex;
                    justify-content: center;
                }
            }
        }
    }
</style>