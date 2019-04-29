<template>
    <div class="holiday-container">
        <header>
            <el-button type="primary" icon="el-icon-edit" size="middle" @click.prevent="addHoli">添加</el-button>
            <el-button type="primary" icon="el-icon-delete" size="middle" @click.prevent="showDelete" v-if="delId.length">删除</el-button>
        </header>
        <footer class="footer">
            <table-data :tableLoading="loadingHoliday" :tableData="holiday" :head="head" :isSelected="true" :isOption="true"
                :isEditTable="true" :editTableName="'编辑'" :isDeleteTable="true" :deleteTableName="'删除'" :isPagination="true"
                @currentChange="currentChange" :totalNumber="totalNumber" @editTable="showEdit"  :optionType="optionType"
                @deleteTable="showDelete" @selectionChange="selectHoliday" :delStyle="delStyle"></table-data>
            <my-dialog :title="title" :show.sync="isShowEdit" :width="'40%'" @close="closeEdit" :center="true" :isConfirm="true" @confirm="confirm" :confirmText="confirmText">
                <my-form :rules="editRule" :formData="editForm" :formItem="formItem" ref="editForm" slot="dialog-content"></my-form>
            </my-dialog>
            <my-dialog :title="'删除节日'" :show.sync="isShowDelete" :width="'30%'" @close="closeDelete" :isCancel="true" @cancel="isShowDelete = false" :isConfirm="true" @confirm="deleteHoliday" :confirmText="'确定'">
                <div class="dia-content" slot="dialog-content">
                    <span v-if="deleteName">是否确定删除【{{deleteName}}】</span>
                    <span v-else>是否确定删除？</span>
                </div>
            </my-dialog>
        </footer>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
import MyForm from '@/components/common/MyForm'
import MyDialog from '@/components/common/MyDialog'
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
            delId: [],
            delStyle: {},
            formItem: [
                {type:'input',size:'small',prop:'name',placeholder: '请输入名称',label: '节日名称：'},
                {type:'year',size:'small',prop:'year',placeholder: '请选择年份',label: '所属年份：'},
                {type:'daterange',size:'small',prop:'resttime',placeholder: '请选择年份',label: '休息日期：'},
                {type:'daterange',size:'small',prop:'worktime',label: '补班日期：'},
                ],
            confirmText: '',
            title: '',
        }
    },
    components: {
        TableData,
        MyDialog,
        MyForm,
        
    },
    computed: {
        
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
            this.confirmText = '保存'
            Object.assign(this.editForm,scope.row)
            this.editForm.resttime = this.editForm.resttime.split('-')
            this.editForm.worktime = this.editForm.worktime.split('-')
            this.isShowEdit = true
        },
        closeEdit: function(data) {
            this.isShowEdit = data
            this.$nextTick(()=> {
                this.$refs['editForm'].$refs.formRef.resetFields();
            }) 
            this.editForm = {name:'',year: '',resttime: [],worktime: []}
        },
        //确认按钮判断
        confirm: function() {
            if(this.confirmText == '保存') {
                this.saveEdit()
            }
            if(this.confirmText == '添加') {
                this.saveAdd()
            }
        },

        //保存编辑
        saveEdit: function() {
          this.$refs['editForm'].$refs.formRef.validate(valid=> {
                if(valid) {
                    this.editHoliday(this.editForm).then(res=> {
                        if(res) {
                            this.$message.success('保存成功')
                            this.isShowEdit = false 
                            this.$nextTick(()=> {
                              this.$refs['editForm'].$refs.formRef.resetFields();
                            })
                            this.editForm = {name:'',year: '',resttime: [],worktime: []}
                        }
                    }).catch(err=> {
                        console.log(err);
                    })
                }
            })
        },
        //保存添加
        saveAdd: function() {
           this.$refs['editForm'].$refs.formRef.validate(valid=> {
                if(valid) {
                    this.addHoliday(this.editForm).then(res=> {
                        if(res) {
                            this.$message.success('添加成功')
                            this.isShowEdit = false 
                            this.$nextTick(()=> {
                               this.$refs['editForm'].$refs.formRef.resetFields();
                            })
                        }
                    }).catch(err=> {
                        console.log(err);
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
        //显示添加节假日弹出层
        addHoli: function() {
            this.title = '节日添加'
            this.confirmText = '添加'
            this.editForm = {name:'',year: '',resttime: [],worktime: []}
            this.isShowEdit = true
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
        
    }
}
</script>

<style lang="scss" scoped>
    .holiday-container {
        margin:0 4%;
        header {
            margin-bottom: 20px;
        }
    }
</style>
