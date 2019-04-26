<template>
    <div class="holiday-container">
        <header>
            <el-button type="primary" icon="el-icon-edit" size="middle" @click.prevent="addHoli">添加</el-button>
            <el-button type="primary" icon="el-icon-delete" size="middle" @click.prevent="showDelete" v-if="delId.length">删除</el-button>
        </header>
        <footer>
            <table-data :tableLoading="loadingHoliday" :tableData="holiday" :head="head" :isSelected="true" :isOption="true"
                :isEditTable="true" :editTableName="'编辑'" :isDeleteTable="true" :deleteTableName="'删除'" :isPagination="true"
                @currentChange="currentChange" :totalNumber="totalNumber" @editTable="showEdit"  :optionType="optionType"
                @deleteTable="showDelete" @selectionChange="selectHoliday"></table-data>
            <el-dialog :title="title" :visible.sync="isShowEdit" width="40%" :before-close="closeEdit" center ref="holiform">
                <el-form :rules="editRule" :model="editForm" ref="editForm" label-position="right">
                    <el-form-item prop="name" label="节日名称：">
                        <el-input size="mini"  v-model="editForm.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="year" label="所属年份：">
                        <el-date-picker size="mini" v-model="editForm.year" type="year" placeholder="请选择年份"> </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="resttime" label="休息日期：">
                        <el-date-picker size="mini" v-model="editForm.resttime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="worktime" label="补班日期：">
                        <el-date-picker size="mini" v-model="editForm.worktime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer" >
                    <el-button type="primary" size="mini" @click="saveEdit" v-if="title == '节日修改'">保存</el-button>
                    <el-button type="primary" size="mini" @click="saveEdit" v-if="title == '节日添加'">添加</el-button>
                </span>
            </el-dialog>
            <el-dialog title="删除节日" :visible.sync="isShowDelete" width="30%" :before-close="closeDelete">
                <span v-if="deleteName">是否确定删除【{{deleteName}}】</span>
                <span v-else>是否确定删除？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="isShowDelete = false">取 消</el-button>
                    <el-button size="mini" type="primary" @click="deleteHoliday">确 定</el-button>
                </span>
            </el-dialog>
        </footer>
    </div>
</template>

<script>
import TableData from '@/components/common/tableData'
export default {
    data() {
        return {
            loadingHoliday: false,
            holiday: [],
            head: [{key: 'year',name: '年份'},{key: 'name',name: '节日名称'},{key: 'resttime',name: '休息时间'},{key: 'worktime',name: '补班时间'}],
            totalNumber: 0,
            optionType:  {'edit':'primary','delete':'danger'},
            isShowEdit: false,
            isShowDelete: false,
            editRule: {name:[{required:true,type: 'string',message:'名称不能为空',trigger:'blur'}],
                        year:[{required:true,message:'年份不能为空',trigger:'blur'}],
                        resttime:[{required:true,message:'必须选择休息日期',trigger:'blur'}]},
            editForm: {name:'',year: '',resttime: [],worktime: []},
            deleteName: '',
            title: '',
            delId: []
        }
    },
    components: {
        TableData
    },
    mounted() {
        this.getHoliday()
    },
    methods: {
        //初始获取假期数据
        getHoliday: function(page=0,size=20) {
            this.loadingHoliday = false
            this.$axios({
                url: `/holiday?page=${page}&size=${size}`,
                method: 'get',
            }).then(res=> {
                if(res) {
                    this.holiday = res.content
                    this.totalNumber = res.totalNumber
                } else {
                    this.$error(res.msg)
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        //翻页查询
        currentChange: function(val) {
            this.getHoliday(val,20)
            console.log(val);
        },
        //显示编辑节假日
        showEdit: function(scope) {
            this.title = '节日修改'
            Object.assign(this.editForm,scope.row)
            this.editForm.resttime = this.editForm.resttime.split('-')
            this.editForm.worktime = this.editForm.worktime.split('-')
            this.isShowEdit = true
        },
        closeEdit: function() {
            this.editForm = {}
            // this.$nextTick(()=> {
            //     this.$refs['holiform'].resetFields();
            // })
           this.isShowEdit = false 
        },
        //保存编辑
        saveEdit: function() {
            this.$refs['editForm'].validate(valid=> {
                if(valid) {
                    this.editHoliday(this.editForm).then(res=> {
                        if(res) {
                            this.$message.success('保存成功')
                            this.isShowEdit = false 
                            this.editForm = {}
                        }
                    })
                }
            })
        },
        //保存添加
        saveAdd: function() {
            this.$refs['editForm'].validate(valid=> {
                if(valid) {
                    this.addHoliday(this.editForm).then(res=> {
                        if(res) {
                            this.$nextTick(()=> {
                                this.$refs['holiform'].resetFields();
                            })
                            this.$message.success('添加成功')
                            this.isShowEdit = false 
                        }
                    })
                }
            })
        },
        //编辑节假日封装
        editHoliday: function(data) {
            return new Promise((resolve,reject)=> {
                this.$axios({
                    url: '/editholiday',
                    method: 'post',
                    data: {...data}
                }).then(res=> {
                    if(res.code == 200) {
                        resolve(res)
                        
                    } else {
                        reject(res)
                    }
                }).catch(err=> {
                    console.log(err);
                })
            })
        },
        //添加节假日封装
        addHoliday: function(data) {
            return new Promise((resolve,reject)=> {
                this.$axios({
                    url: '/addholiday',
                    method: 'post',
                    data: {...data}
                }).then(res=> {
                    if(res.code == 200) {
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(err=> {
                    console.log(err);
                })
            })
        },
        //显示删除节假日
        showDelete: function(scope) {
            this.deleteName = ''
            if(scope && scope.row && scope.row.name) this.deleteName = scope.row.name
            this.isShowDelete = true
        },
        //单个删除节假日
        deleteHoliday: function() {
            this.$axios({
                url: '/deleteholiday',
                method: 'post',
            }).then(res=> {
                if(res.code == 200) {
                    this.$message.success('删除成功！')
                } else {
                    this.$message.error('删除失败，该节日不存在，请刷新页面！')
                }
                this.isShowDelete = false
            }).catch(err=> {
                console.log(err);
            })
        },
        closeDelete: function() {
            this.isShowDelete = false
        },
        //批量选择节假日
        selectHoliday: function(val) {
            this.delId = []
            val.forEach(item=> {
                this.delId.push(item)
            })
        },
        //批量删除节假日
        delHoliday: function() {
            this.$axios({
                url: '/delHoli',
                method: 'post',
                data: {id:this.delId}
            }).then(res=> {
                if(res.code == 200) {
                    this.$message.success('删除成功！')
                } else {
                    this.$message.error('删除失败，该节日不存在，请刷新页面！')
                }
                this.isShowDelete = false
            }).catch(err=> {
                console.log(err);
            })
        },
        //显示添加节假日弹出层
        addHoli: function() {
            this.title = '节日添加'
            this.editForm = {}
            this.isShowEdit = true
        }
    }
}
</script>

<style lang="scss" scoped>
    .holiday-container {
        margin:0 4%;
        header {
            margin-bottom: 20px;
        }
        footer {
            .el-form {
                display: flex;
                flex-direction: column;
                .el-form-item {
                    display: flex;
                    flex-direction: row;
                }
            }
        }

    }
</style>
