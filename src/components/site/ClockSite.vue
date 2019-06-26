<template>
    <div class="clocksite-container">
        <section>
            <table-data :head="sitehead" :tableData="siteInfo.content" :isSelected="false" :option="option"  :totalNumber="siteInfo.total" @delTable="delTable" @editTable="editTable" 
            @chooseTable="chooseTable" @currentChange="nextPage" :format="format" :data="searchInfo" :formData="formItem" @btnClick="searchSite" :mutiItem="mutiItem" @createSite="createSite">
                <template #special="{scope: scope}">
                    <slot name="clockstyle" :scope="scope"></slot>
                </template>
            </table-data>
        </section>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
import utils from '@/utils/utils'
export default {
    props: {
        searchInfo: {type: Object},
        siteInfo: {type:Object},
        sitehead: {type:Array},
        option: {type: Array},
    },
    data() {
        return {
            formItem:[{type:'input',label:'name',placeholder:'考勤地点'},{type:'input',label:'city',placeholder:'城市'},{type:'button',btnType:'primary',nameText:'搜索'}],
            mutiItem: {right:[{nameText:'添加',className:'el-icon-circle-plus-outline',event:'createSite'}]}
        }
    },
    methods: {
        format: function(cellvalue,property) {
            if(property == 'clockGroup') {
                return cellvalue ? cellvalue.map(item=> item.name).join(';') : '无'
            } else if(property == 'officeDevices') {
                return utils.filterClockType(cellvalue)
            } else {
                return cellvalue
            }
        },
        editTable: function(scope) {
            this.$emit('editTable',scope)
        },
        chooseTable: function(scope) {
            this.$emit('chooseTable',scope)
        },
        delTable: function(scope) {
            this.$emit('delTable',scope)
        },
        nextPage: function(val) {
            this.$emit('nextPage',val)
        },
        createSite: function() {
            this.$emit('createSite')
        },
        searchSite: function() {
            this.$emit('searchSite')
        }
    },
    components: {
        TableData
    }
}
</script>

<style lang="scss" scoped>
    .clocksite-container{
        section {
            .add {
                font-size: 12px;
                display: flex;
                align-items: center;
                color: #0096FF;
                font-weight: 700;
                cursor: pointer;
                >i {
                    font-size: 16px;
                    font-weight: 700;
                    margin-right: 4px;
                }
            }
        }
    }
</style>
