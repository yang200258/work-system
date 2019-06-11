<template>
    <div class="form-container">
        <div class="form-wrapper" v-for="(item,i) in formData" :key="i">
            <my-input v-if="item.type === 'input'" :placeholder="item.placeholder" :inputData="data[item.label]" :size="size"></my-input>
            <select-tree v-if="item.type === 'selectTree'" :nameText="item.nameText" :loadNode="loadNode" :id.sync="data[item.label]" :tipText="item.tipText"></select-tree>
            <muti-select v-if="item.type === 'mutiSelect'" :nameText="item.nameText" :options="item.options" @changeMutiSelect="changeMutiSelect($event,item.label)"></muti-select>
            <el-button v-if="item.type === 'button'" :type="item.btnType" @click.prevent="btnClick" :size="size">{{item.nameText}}</el-button>
        </div>
    </div>
</template>

<script>
import MyInput from './MyInput'
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
        tipText: {type:String,default:'全部'}
    },
    components: {MyInput,SelectTree,MutiSelect},
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
        }
    }
}
</script>

<style lang="scss" scoped>
    .form-container {
        display: flex;
        align-items: center;
        .form-wrapper {
            margin-right: 28px;
            .muti-select {
                display: flex;
                align-items: center;
                &:hover {
                    cursor: pointer;
                }
                p {
                    font-size:12px;
                    color: #444853;
                    white-space: nowrap;
                }
                .all-select {
                   /deep/ .el-input {
                        height: 28px;
                        width: 44px;
                    } 
                }
                .el-select {
                    /deep/ .el-input {
                        height: 28px;
                        .el-input__inner {
                            border: none;
                            padding-right: 0;
                            padding-left: 10px;
                            color: #444853;
                        }
                        .el-input__suffix {
                            display: none;
                        }
                    }
                    /deep/ .el-select__tags {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        >span {
                            display: flex;
                            align-items: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            .el-tag__close {
                                display: none;
                            }
                            span {
                                bottom: #E9EEF4;
                                padding: 0;
                            }
                        }
                    }
                }
                .icon-sanjiao {
                    z-index: 100;
                }
            }
        }
    }
</style>
