<template>
    <div class="usermanage-container">
        <div class="usermanage-content">
            <table-data :head="head" :tableData="tableData" :tableLoading="loading" :isSelected="true" :option="option" :totalNumber="total" @editTable="editUser" @delTable="stopUse" 
             @currentChange="currentChange" :data="queryUserData" :formData="formData"  @btnClick="searchUser" @changeMutiSelect="changeMutiSelect" :getRowKey="getRowKey"
             ></table-data>
        </div>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
export default {
    data() {
        return {
            queryUserData:{},
            isSearch: [],  //判断查询还是条件搜索用户
            // rootNode:[],
            head: [{key: 'name',name: '姓名'},{key: 'username',name: '账号'},{key: 'organizationName',name: '部门'},{key: 'employeeId',name: '工号'},{key: 'role',name: '角色'},
                    {key: 'workTypeName',name: '员工类型'},{key: 'clockGroupName',name: '考勤组'},{key: '',name: '账号状态'}],
            loading: false,
            tableData: [],
            total: 0,
            option: [{name: '编辑',event: 'editTable',type:1},{name: '停用',event: 'delTable',type:2}],
            formData: [{type:'input',placeholder: '员工姓名/员工账号',label: 'q'},{type:'selectTree',placeholder:'全部',nameText:'所属部门',label:'oid',tipText:'全部'},
                        // {type:'mutiSelect',nameText:'员工类型',placeholder:'全部',label:'userType',options: [{name:'正式员工',id: 0},{name:'劳派员工',id: 1},{name:'外包员工',id: 2}]},
                        {type:'mutiSelect',nameText:'角色',placeholder:'全部',label:'rid',options: [{name:'正式员工',id: 0},{name:'劳派员工',id: 1},{name:'外包员工',id: 2}]},
                        {type:'mutiSelect',nameText:'考勤组',placeholder:'全部',label:'gid',options: [{name:'考勤组1',id: '0'},{name:'考勤组2',id: '1'},{name:'考勤组3',id: '2'}]},
                        // {type:'mutiSelect',nameText:'账号状态',placeholder:'全部',label:'accountStatus',options: [{name:'休假',id: 'regular'},{name:'离职',id: 'regular2'},{name:'正常',id: 'regular3'}]},
                        {type:'button',nameText: '查询',btnType:'primary'}]
        }
    },
    components: {
        TableData,
    },
    mounted() {
        //获取用户
        this.queryUserGroup()
    },
    methods: {
        //获取用户列表（页面初始数据）
        async queryUserGroup(oid=0,page=0,size=20) {
            this.loading = true
            try {
                let res = await this.$axios({url: `/sys/users?oid=${oid}&page=${page}&size=${size}`,method: 'get'})
                console.log('获取到用户列表数据',res);
                if(res) {
                    this.tableData = res.content
                    this.total = res.recordCount
                }
                this.isSearch = this.loading = false
            }catch(err) {
                console.log(err)
            }
        },
        searchUser: function() {
            this.queryUser(this.queryUserData)
        },
        //查询用户
        async queryUser(searchInfo,page=0 , size=20) {
            console.log(searchInfo)
            this.loading = true
            try {
                let res = await this.$axios({url: `/sys/users/_search?page=${page}&size=${size}`,method: 'post',data: searchInfo})
                if(res) {
                    this.tableData = res.content
                    this.total = res.recordCount
                }
                this.loading = false
                this.isSearch = true
             }catch(err) {
                console.log(err)
             }
        },
        //翻页
        currentChange: function(val) {
            if(!this.isSearch) {
                this.queryUserGroup(0,val,20)
            } else {
                this.queryUser(this.searchInfo,val,20)
            }
            document.documentElement.scrollTop = 0
        },
        //编辑用户信息
        editUser: function() {
            this.$message.error('开发中,勿急！')
        },
        stopUse: function() {
            this.$message.error('开发中,勿急！')
        },
        changeMutiSelect: function(val1,val2) {
            this.queryUserData[val2] = val1
        },
        getRowKey: function(row) {
            return row.id
        }
    }
}
</script>
