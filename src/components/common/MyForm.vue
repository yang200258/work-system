<template>
    <div class="myform-container">
        <el-form :rules="rules" :model="formData" :label-position="position" ref="formRef" :hide-required-asterisk="hideRequired" :inline="isInline" :label-width="labelWidth">
            <el-form-item v-for="(item,index) in formItem" :prop="item.prop" :label="item.label" :key="index" v-show="!item.hide">
                <!-- 前置插槽***************** -->
                <slot :name="item.preSlotName"></slot>
                <!-- 点选框 -->
                <el-radio-group v-model="formData[item.prop]" v-if="item.type == 'radio'" :size="size">
                    <el-radio v-for="(option,i) in item.options" :label="option.value" :key="i">{{option.name}}</el-radio>
                </el-radio-group>
                <!-- 选择框 -->
                <el-checkbox-group v-model="formData[item.prop]" v-if="item.type == 'check'" :size="size">
                    <el-checkbox v-for="(option,i) in item.options" :label="option.value" :key="i">{{option.name}}</el-checkbox>
                </el-checkbox-group>
                <!-- 点击选择 -->
                <el-checkbox v-if="item.type == 'checkbox'" v-model="formData[item.prop]" @change="changeCheck" :size="size">{{item.checkBoxName}}</el-checkbox>
                <!-- checkbox插槽 -->
                <slot v-if="item.type == 'checkbox' && formData[item.prop]" :name="item.slotName"></slot>
                <!-- 输入 -->
                <el-input v-model="formData[item.prop]" v-if="item.type == 'input'" :placeholder="item.placeholder" clearable :type="item.inputType" :size="size" 
                :disabled="item.disable || read" :rows="item.rows" :class="item.className"></el-input>
                <!-- 选择 -->
                <el-select v-model="formData[item.prop]" :placeholder="item.placeholder" v-if="item.type == 'select'" :size="size" :collapse-tags="item.collapseTags" :multiple="item.multiple" :disabled="read"
                    @change="changeSelect($event,item.prop)">
                    <el-option v-for="(option,i) in item.options" :key="i" :label="option.name" :value="option.id"></el-option>
                </el-select>
                <!-- 树 -->
                <select-tree v-if="item.type == 'select-tree'" v-model="formData[item.prop]" :loadNode="loadNode" :id.sync="item.returnArray" :tipText="item.text"></select-tree>
                <!-- 滑动/ -->
                <el-slider v-if="item.type == 'slider'" v-model="formData[item.prop]"  :size="size"></el-slider>
                <!-- 日期 -->
                <el-date-picker v-if="item.type == 'date'" :type="item.dateType"  v-model="formData[item.prop]" :placeholder="item.placeholder" :size="size" :value-format='item.valueFormat' 
                    :default-value="formData[item.prop] && formData[item.prop][0]" :format="item.format" :picker-options="item.options" :range-separator="item.rangeSeparator" 
                    :start-placeholder="item.startPlaceholder" :end-placeholder="item.endPlaceholder">
                </el-date-picker>
                <!-- 计数 -->
                <el-input-number v-if="item.type == 'inputNumber'" :size="size" v-model="formData[item.prop]" :min="item.min" :max="item.max" :label="item.label" :controls-position="item.controlsPosition"></el-input-number>
                <el-switch v-if="item.type == 'switch'" v-model="formData[item.prop]" active-color="#13ce66" @change="switchChange" :size="size"></el-switch>
                <el-button v-if="item.type == 'button'" :icon="item.icon" :type="item.buttonType" :size="size" @click.prevent="clickEvent(item.event)">{{item.text}}</el-button>
                <!-- 后置插槽*********************************** -->
                <slot :name="item.suffixSlotName"></slot>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import SelectTree from './SelectTree'
export default {
    props: {
        rules: {type: Object,default: function() { return {}}},
        formData: {type: Object,default: function() { return {}}},
        position: {type: String,default: 'right'},
        formItem: {type: Array},
        size: {type: String,default: 'mini'},
        hideRequired: {type:Boolean,default: true},
        isInline: {type:Boolean,default: false},
        read: {type: Boolean,default:false},
        labelWidth:{type:String,default:'80px'}
        // collapseTags: {type:Boolean,default:true},
        // multiple: {type:Boolean,default:true}
    },
    data() {
        return {

        }
    },
    methods: {
        loadNode: function(node,resolve) {
            this.$emit('loadNode',node,resolve)
        },
        //分发点击按钮事件
        clickEvent: function(eventName) {
            this.$emit(eventName)
        },
        changeSelect: function(val,prop) {
            this.$emit('changeSelect',val,prop)
        },
        switchChange: function(val) {
            this.$emit('switchChange',val)
        },
        changeCheck: function(val) {
            this.$emit('changeCheck',val)
        },
    },
    components:{
        SelectTree
    }
}
</script>

<style lang="scss" scoped>
.myform-container {
    .el-form {
        /deep/ .el-form-item {
            // display: flex;
            .el-form-item__label {
                white-space: nowrap;
                font-size: 12px;
            }
            .el-form-item__content {
                font-size: 12px;
                display: flex;
                align-items: center;
                .el-switch {
                    height: 40px;
                }
                .el-select--mini {
                    .el-input--mini {
                        input {
                            height: 28px!important;
                        }
                    }
                }
                .el-checkbox {
                    display: flex;
                    align-items: center;
                    .el-checkbox__label {
                        font-size: 12px;
                    }    
                }
                .el-checkbox-group {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    .el-checkbox {
                        display: flex;
                        align-items: center;
                        .el-checkbox__label {
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
}
</style>
