<template>
    <div class="holiday-container">
        <footer class="footer">
            <table-data :tableLoading="loadingHoliday" :tableData="holiday" :head="head" :isSelected="true" @currentChange="currentChange" :totalNumber="totalNumber" 
                @editTable="showEdit" @delTable="showDelete" @selectionChange="selectHoliday" :format="format" :isSearch="false" :mutiItem="mutiItem" @showDelete="showDelete" @addHoli="addHoli">
            </table-data>
            <my-dialog :title="title" :show.sync="isShowEdit" :width="'40%'" @close="closeEdit" :center="true" :isConfirm="true" @confirm="confirm" :confirmText="confirmText">
                <my-form :rules="editRule" :formData="editForm" :formItem="formItem" ref="editForm" slot="dialog-content" :position="'right'" class="editForm"></my-form>
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
import utils from '@/utils/utils'
export default {
    data() {
        return {
            mutiItem: {left:[{nameText:'删除',className:'el-icon-delete',event:'showDelete'}],right:[{nameText:'添加',className:'el-icon-circle-plus-outline',event:'addHoli'}]},   //批量操作选项组
            loadingHoliday: false,
            holiday: [],
            head: [{key: 'year',name: '年份'},{key: 'name',name: '节日名称'},{key: 'vacationDays',name: '休息时间'},{key: 'workDays',name: '补班时间'}],
            totalNumber: 0,
            optionType:  {'edit':'primary','delete':'danger'},
            isShowEdit: false,
            isShowDelete: false,
            editRule: {name:[{required:true,type: 'string',message:'名称不能为空',trigger:'blur'}],
                        year:[{required:true,message:'年份不能为空',trigger:'blur'}],
                        vacationDays:[{required:true,message:'必须选择休息日期',trigger:'blur'}]},
            editForm: {name:'',year: '',vacationDays: [],workDays: []},
            deleteName: '',
            delId: [],
            formItem: [
                {type:'input',inputType:'text',size:'small',prop:'name',placeholder: '请输入名称',label: '节日名称：'},
                {type:'date',dateType:'year',size:'small',prop:'year',placeholder: '请选择年份',label: '所属年份：',valueFormat:'yyyy'},
                {type:'date',dateType:'dates',size:'small',prop:'vacationDays',placeholder: '选择一个或多个日期',label: '休息日期：',format:'yyyy年MM月dd日',valueFormat:'yyyy/MM/dd'},
                {type:'date',dateType:'dates',size:'small',prop:'workDays',placeholder: '选择一个或多个日期',label: '补班日期：',format:'yyyy年MM月dd日',valueFormat:'yyyy/MM/dd',options: {disabledDate: time => {
                    let distime = this.editForm.vacationDays
                    let timer = utils.filterDate(time)
                    if(distime && distime.length && distime.includes(timer)) return true
                }}},
                ],
            confirmText: '',
            title: '',
        }
    },
    created() {
        
    },
    watch: {
        'editForm.vacationDays': function(val) {
            if(val) {
                let sametime = this._.intersection(val,this.editForm.workDays)
                let workDays = this._.pullAll(this.editForm.workDays,sametime)
                this.editForm.workDays = workDays
                return val
            }
        },
    },
    computed: {
        
    },
    components: {
        TableData,
        MyDialog,
        MyForm,
    },
    mounted() {
        this.getHoliday()
    },
    methods: {
        //格式化表格数据
        format: function(cellvalue,property) {
            if(property == 'vacationDays' || property == 'workDays') { 
                return cellvalue == '' ? '无' : cellvalue
            } else {
                return cellvalue
            }
        },
        //初始获取假期数据
        getHoliday: function(page=0,size=20) {
            this.loadingHoliday = false
            this.$axios({
                url: `/sys/festival/list?page=${page}&size=${size}`,
                method: 'get',
            }).then(res=> {
                if(res) {
                    this.holiday = res.content
                    this.totalNumber = res.recordCount
                } else {
                    this.$message.error(res.msg)
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        //翻页查询
        currentChange: function(val) {
            console.log(val);
            this.getHoliday(val,20)
        },
        closeEdit: function(data) {
            this.isShowEdit = data
            this.$nextTick(()=> {
                this.$refs['editForm'].$refs.formRef.resetFields()
            }) 
            this.editForm = {name:'',year: '',vacationDays: [],workDays: []}
            console.log('------------',this.editForm);
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
        //显示编辑节假日
        showEdit: function(scope) {
            this.title = '节日修改'
            this.confirmText = '保存'
            Object.assign(this.editForm,scope.row)
            this.editForm.year = this.editForm.year.toString()
            this.editForm.vacationDays = this.editForm.vacationDays && this.editForm.vacationDays.split(';')
            this.editForm.workDays = this.editForm.workDays && this.editForm.workDays.split(';') || []
            this.isShowEdit = true
        },
        //保存编辑
        saveEdit: function() {
          this.$refs['editForm'].$refs.formRef.validate(valid=> {
                if(valid) {
                    let editForm = this.editForm
                    editForm.vacationDays = typeof(editForm.vacationDays) == 'string' ? editForm.vacationDays : editForm.vacationDays.join(';')
                    editForm.workDays = editForm.workDays && editForm.workDays.join(';') || ''
                    this.editHoliday(editForm).then(res=> {
                        if(res) {
                            this.$message.success(res)
                            this.isShowEdit = false 
                            this.$nextTick(()=> {
                              this.$refs['editForm'].$refs.formRef.resetFields();
                            })
                            this.editForm = {name:'',year: '',vacationDays: [],workDays: []}
                            this.getHoliday()
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
                    url: '/sys/festival/saveFestival',
                    method: 'post',
                    data: {...data}
                }).then(res=> {
                    if(res) {
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
            this.editForm = {name:'',year: '',vacationDays: [],workDays: []}
            this.isShowEdit = true
        },
        //保存添加
        saveAdd: function() {
           this.$refs['editForm'].$refs.formRef.validate(valid=> {
                if(valid) {
                    this.editForm.vacationDays = this.editForm.vacationDays.join(';')
                    this.editForm.workDays = this.editForm.workDays.join(';')
                    this.addHoliday(this.editForm).then(res=> {
                        if(res) {
                            this.$message.success('添加成功')
                            this.isShowEdit = false 
                            this.$nextTick(()=> {
                               this.$refs['editForm'].$refs.formRef.resetFields();
                            })
                            this.getHoliday()
                        }
                    }).catch(err=> {
                        console.log(err)
                    })
                }
            })
        },
        //添加节假日封装
        addHoliday: function(data) {
            data.id = 0
            return new Promise((resolve,reject)=> {
                this.$axios({
                    url: '/sys/festival/saveFestival',
                    method: 'post',
                    data: {...data}
                }).then(res=> {
                    if(res)  resolve(res)
                }).catch(err=> {
                    reject(err)
                })
            })
        },
        //显示删除节假日
        showDelete: function(scope) {
            this.deleteName = ''
            if(scope && scope.row && scope.row.id)  {
                this.deleteName = scope.row.name
                this.delId = [scope.row.id]
            }
            this.isShowDelete = true
        },
        //单个删除节假日
        deleteHoliday: function() {
            let id = this.delId
            this.$axios({
                url: '/sys/festival/deleteFestival',
                method: 'post',
                data: {id}
            }).then(res=> {
                if(res) {
                    this.$message.success(res)
                    this.delId = []
                }
                this.isShowDelete = false
                this.getHoliday()
            }).catch(err=> {
                console.log('删除节假日时出错',err)
            })
        },
        closeDelete: function() {
            this.isShowDelete = false
            this.delId = []
        },
        //批量选择节假日
        selectHoliday: function(val) {
            this.delId = []
            val.forEach(item=> {
                this.delId.push(item.id)
            })
        },
        //批量删除节假日
        delHoliday: function() {
            this.deleteHoliday()
            this.getHoliday()
        },
        
    }
}
</script>

<style lang="scss" scoped>
    .holiday-container {
        .footer {
            .editForm {
                /deep/ .el-form-item {
                    display: flex;
                }
            }
        }
    }
</style>
