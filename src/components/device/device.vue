<template>
    <div class="bluetooth-manage">
        <section class="bluetooth-content">
            <table-data :head="table.head" :isSelected="false" :tableData="table.content" :tableLoading="table.loading" :option="option" :totalNumber="table.total" @currentChange="currentChange" @chooseTable="chooseTable"
            @editTable="editTable" @delTable="delTable" :data="searchInfo" :formData="formItem" @btnClick="searchDevice"></table-data>
        </section>
    </div>
</template>
<script>
import TableData from '@/components/common/TableData'
export default {
    props: {
        table: {type: Object},
        searchInfo: {type: Object},
    },
    data() {
        return {
            option:[{name: '查看',type:1,event: 'chooseTable'},{name: '编辑',type:1,event: 'editTable'},{name:'停用',type:2,event: 'delTable'}],
            formItem: [{type:'input',label:'no',placeholder:'设备编号'},{type:'checkbox',label:'isException',nameText:'只显示通信异常设备（最近5天没有通信）'},{type:'button',btnType:'primary',nameText:'搜索'}]
        }
    },
    components: {
        TableData,
        // MyDialog
        },
    methods: {
        searchDevice: function() {
            this.$emit('searchDevice',this.searchInfo)
        },
        currentChange: function(val) {
            this.$emit('currentChange',val)
        },
        delTable: function(scope) {
            this.$emit('delTable',scope)
        },
        editTable: function(scope) {
            this.$emit('editTable',scope)
        },
        chooseTable: function(scope) {
            this.$emit('chooseTable',scope)
        }
    }
}
</script>

<style lang="scss" scoped>
    .bluetooth-manage {
        // margin: 20px 40px;
    }
</style>

