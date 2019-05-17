<template>
    <div class="clockgroup-manage">
        <header class="clockgroup-header">
            <div class="left">
                <my-input v-for="(item,i) in searchInfo" :key="i" :data="item"></my-input>
                <my-select :info="styleData.info" :data="styleData"></my-select>
                <el-button icon="el-icon-search" type="primary">搜索</el-button>
            </div>
            <el-button icon="el-icon-edit" type="primary" @click="isShowCreate = true">添加</el-button>
        </header>
        <section class="clockgroup-content">
            <table-data :head="head" :tableData="clockGroupData" :tableLoading="clockGroupLoading" :option="option"></table-data>
        </section>
        <my-dialog :title="'新建考勤组'" :width="'40%'" :show.sync="isShowCreate" :isCancel="true" :confirmText="'提交'" @close="closeCreate" @cancel="cancelCreate" class="create-group" @confirm="goCreate">
            <template slot="dialog-content">
                <my-input :data="groupData">
                    <template slot="tip">
                        <p class="tip">Tip：推荐按照考勤地点加时间段的方式命名考勤组，如“海南大厦26层-9点至17点30分”</p>
                    </template>
                </my-input>
                <div class="clock-type">
                    <div class="text">
                        <p>班次类型</p>
                    </div>
                    <el-radio-group v-model="clockType" class="radio-wrapper">
                        <el-radio :label="1">固定班次<span class="radioTip">每天的考勤时间一样</span></el-radio>
                        <el-radio :label="2">排班制<span class="radioTip">自定义设置考勤时间</span></el-radio>
                    </el-radio-group>
                </div>
            </template>
        </my-dialog>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
import MyDialog from '@/components/common/MyDialog'
import MyInput from '@/components/common/MyInput'
import MySelect from '@/components/common/MySelect'
export default {
    data() {
        return {
            // ----------------------搜索考勤组--------------------
            searchInfo: [{text: '考勤组名称',placeholder:'请输入内容',info:''},{text: '考勤地点',placeholder:'请输入内容',info:''},{text: '创建人',placeholder:'请输入内容',info:''}],
            styleData: {info: [],text: '打卡方式',placeholder:'请选择打卡方式',options: [{label:'蓝牙',value: 0},{label:'WIFI',value: 1},{label:'GPS',value: 2}]},
            // -------------------------考勤组展示-------------------------
            head:[{key: 'name',label:'考勤组名称'},{key: '',label:'考勤地点/打卡方式'},{key: '',label:'班次类型'},{key: '',label:'成员数'},{key: '',label:'创建人'},
                    {key: '',label:'更新时间'}],
            clockGroupData: [],
            clockGroupLoading: false,
            option:[{name: '查看',type:'success',event: 'chooseTable'},{name: '编辑',type:'primary',event: 'editTable'},{name:'删除',type:'danger',event: 'delTable'}],
            // --------------创建考勤组-------------------
            isShowCreate: false,
            groupData: {text: '考勤组名称',placeholder:'请输入考勤组名称',info:''},
            clockType: 1
        }
    },
    components: {TableData,MyDialog,MyInput,MySelect},
    methods: {
        closeCreate: function() {
            this.isShowCreate = false
        },
        cancelCreate: function() {
            this.isShowCreate = false
        },
        goCreate: function() {
            if(!this.groupData.info) return this.$message.error('请先填写考勤组名称')
            this.isShowCreate = false
            this.$router.push('create_clock_group')
        }
    }
}
</script>

<style lang="scss" scoped>
    .clockgroup-manage {
        margin: 0 40px;
        .clockgroup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .el-button {
                margin-left: 20px;
            }
            .left {
                display: flex;
                align-items: center;
                .myinput-container {
                    margin-right: 20px;
                }
            }
        }
        .create-group {
            /deep/ .el-dialog__body {
                padding-right: 60px;
            }
            .tip {
                font-family: 'PingFangSC-Regular', 'PingFang SC';
                font-size: 13px;
                color: rgb(153, 153, 153);
                white-space: normal;
            }
            .clock-type {
                display: flex;
                margin-top: 30px;
                .text {
                    width: 70px;
                    p {
                        white-space: nowrap;
                        font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC';
                        font-style: normal;
                        color: #666666;
                        font-size: 14px;
                    }
                }
                .radio-wrapper {
                    display: flex;
                    flex-direction: column;
                    margin-left: 20px;
                    .el-radio {
                        &:last-child {
                            margin-top: 40px;
                            /deep/ .el-radio__label {
                                letter-spacing: 5px;
                                span {
                                   letter-spacing: 0; 
                                }
                            }
                        }
                    }
                    // 班次设置tip文字样式
                    .radioTip {
                        color: #bbb;
                        font-size: 12px;
                        display: inline-block;
                        margin-left: 20px;
                    }
                }
            }
        }
    }
</style>

