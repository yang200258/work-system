<template>
    <div class="myform-container">
        <el-form :rules="rules" :model="formData" :label-position="position" ref="formRef" :hide-required-asterisk="hideRequired" :inline="isInline">
            <el-form-item v-for="(item,index) in formItem" :prop="item.prop" :label="item.label" :key="index">
                <el-radio-group v-model="formData[item.prop]" v-if="item.type == 'radio'" :size="size">
                    <el-radio v-for="(option,i) in item.options" :label="option.value" :key="i">{{option.name}}</el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="formData[item.prop]" v-if="item.type == 'check'" :size="size">
                    <el-checkbox v-for="(option,i) in item.options" :label="option.value" :key="i">{{option.name}}</el-checkbox>
                </el-checkbox-group>
                <el-input v-model="formData[item.prop]" v-if="item.type == 'input'" :placeholder="item.placeholder" clearable :type="item.inputType" :size="size"></el-input>
                <el-select v-model="formData[item.prop]" :placeholder="item.placeholder" v-if="item.type == 'select'" :size="size" collapse-tags multiple>
                    <el-option v-for="(option,i) in item.options" :key="i" :label="option.name" :value="option.value"></el-option>
                </el-select>
                <select-tree v-if="item.type == 'select-tree'" v-model="formData[item.prop]" :loadNode="loadNode" :id.sync="item.returnArray" :tipText="item.text"></select-tree>
                <el-slider v-if="item.type == 'slider'" v-model="formData[item.prop]"  :size="size"></el-slider>
                <el-date-picker v-if="item.type == 'date'" :type="item.dateType"  v-model="formData[item.prop]" :placeholder="item.placeholder" :size="size" :value-format='item.valueFormat' 
                    :default-value="formData[item.prop] && formData[item.prop][0]" :format="item.format" :picker-options="item.options" :range-separator="item.rangeSeparator" 
                    :start-placeholder="item.startPlaceholder" :end-placeholder="item.endPlaceholder">
                </el-date-picker>
                <el-button v-if="item.type == 'button'" :icon="item.icon" :type="item.buttonType" :size="size" @click.prevent="clickEvent(item.event)">{{item.text}}</el-button>
                 <slot v-if="item.type == 'slot'" :name="item.name"></slot>
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
        }
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
            .el-form-item__label {
                white-space: nowrap;
            }
        }
    }
}
</style>
