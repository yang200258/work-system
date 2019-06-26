<template>
    <div class="form-container">
        <div class="form-wrapper" v-for="(item,i) in formData" :key="i">
            <p v-if="item.type === 'text'">{{item.nameText}}</p>
            <el-input v-if="item.type === 'input'" :placeholder="item.placeholder" v-model="data[item.label]" :size="size" clearable @keyup.enter.native="inputSearch">
                <i v-if="item.isSuffix" slot="suffix" class="el-input__icon el-icon-search" @click.prevent="inputSearch"></i>
            </el-input>
            <select-tree v-if="item.type === 'selectTree'" :nameText="item.nameText" :loadNode="loadNode" :id.sync="data[item.label]" :tipText="item.tipText"></select-tree>
            <muti-select v-if="item.type === 'mutiSelect'" :nameText="item.nameText" :options="item.options" @changeMutiSelect="changeMutiSelect($event,item.label)"></muti-select>
            <el-button v-if="item.type === 'button'" :type="item.btnType || 'primary'" @click.prevent="btnClick" :size="size">{{item.nameText}}</el-button>
            <el-checkbox v-if="item.type === 'checkbox'" v-model="data[item.label]">{{item.nameText}}</el-checkbox>
            <el-date-picker v-if="item.type == 'date'" :type="item.dateType"  v-model="data[item.label]" :placeholder="item.placeholder" :size="size" :value-format='item.valueFormat' 
                    :default-value="formData[item.prop] && formData[item.prop][0]" :format="item.format" :picker-options="item.options" :range-separator="item.rangeSeparator" 
                    :start-placeholder="item.startPlaceholder" :end-placeholder="item.endPlaceholder">
            </el-date-picker>
        </div>
    </div>
</template>

<script>
import SelectTree from './SelectTree'
import MutiSelect from './MutiSelect'
export default {
    props: {
        formData: {type: Array},
        data: {type:Object},
        size: {type: String,default:'mini'},
        loadNode: {
            type: Function,
            default: function() {}
        },
    },
    components: {SelectTree,MutiSelect},
    data() {
        return {

        }
    },
    methods: {
        changeMutiSelect: function(label,val) {
            this.$emit('changeMutiSelect',label,val)
            // this.queryUserData[val2] = val1
        },
        btnClick: function() {
            this.$emit('btnClick')
        },
        inputSearch: function() {
            this.$emit('inputSearch')
        },
    }
}
</script>

<style lang="scss" scoped>
    .form-container {
        display: flex;
        align-items: center;
        // flex-wrap: wrap;
        .form-wrapper {
            margin-right: 20px;
            display: flex;
            align-items: center;
            height: 28px;
            text-align: center;
            padding: 0 4px;
            border-radius: 4px;
            &:hover {
                cursor: pointer;
                background-color: #eee;
            }
            /deep/ .el-checkbox {
                .el-checkbox__label {
                    font-size: 12px;
                }
            }
        }
    }
</style>
