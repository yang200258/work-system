<template>
    <div class="select-container">
        <el-form :rules="rules" :model="formData" :label-position="position" ref="formRef" :hide-required-asterisk="hideRequired">
            <el-form-item v-for="(item,index) in formItem" :prop="item.prop" :label="item.label" :key="index" label-width="auto">
                <el-radio-group v-model="formData[item.prop]" v-if="item.type == 'radio'" :size="size">
                    <el-radio v-for="(option,i) in item.options" :label="option.value" :key="i">{{option.name}}</el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="formData[item.prop]" v-if="item.type == 'check'" :size="size">
                    <el-checkbox v-for="(option,i) in item.options" :label="option.value" :key="i">{{option.name}}</el-checkbox>
                </el-checkbox-group>
                <el-input v-model="formData[item.prop]" v-if="item.type == 'input'" :placeholder="item.placeholder" clearable :type="item.text" :size="size" autocomplete="off"></el-input>
                <el-select v-model="formData[item.prop]" :placeholder="item.placeholder" v-if="item.type == 'select'" :size="size" collapse-tags multiple>
                    <el-option v-for="(option,i) in item.options" :key="i" :label="option.name" :value="option.value"></el-option>
                </el-select>
                <select-tree v-if="item.type == 'select-tree'" v-model="formData[item.prop]" :loadNode="loadNode" :id.sync="item.returnArray" :tipText="item.text"></select-tree>
                <el-slider v-if="item.type == 'slider'" v-model="formData[item.prop]"  :size="size"></el-slider>
                <el-date-picker v-if="item.type == 'date' || item.type == 'year'" v-model="formData[item.prop]" :type="item.type" :placeholder="item.placeholder" :size="size" value-format='yyyy/MM/dd'></el-date-picker>
                <el-date-picker v-if="item.type == 'dates'" v-model="formData[item.prop]" :type="item.type" :placeholder="item.placeholder" :size="size" value-format='yyyy/MM/dd' format="yyyy年MM月dd日"
                :picker-options="item.options"></el-date-picker>
                <el-date-picker v-if="item.type == 'daterange' " v-model="formData[item.prop]" :type="item.type" :size="size" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                 value-format='yyyy/MM/dd'></el-date-picker>
            </el-form-item>
            <slot></slot>
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
        labelWidth: {type:Number}
    },
    data() {
        return {

        }
    },
    methods: {
        loadNode: function(node,resolve) {
            this.$emit('loadNode',node,resolve)
        },
        // validate: function() {
        //     this.$emit('validate')
        // },
        // resetFields: function() {
        //     this.$emit('resetFields')
        // },
    },
    components:{
        SelectTree
    }
}
</script>

<style lang="scss" scoped>
    .el-form {
            display: flex;
            flex-direction: column;
            & /deep/ .el-form-item {
                display: flex;
                flex-direction: row;
            }
        }
</style>
