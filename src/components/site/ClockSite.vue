<template>
    <div class="clocksite-container">
        <section>
            <table-data :head="sitehead" :tableData="siteInfo.content" :isSelected="false" :option="option" :totalNumber="siteInfo.recordCount" @delTable="delTable" @editTable="editTable" 
            @chooseTable="chooseTable" @currentChange="nextPage" :format="format" :data="searchInfo" :formData="formItem" @btnClick="searchSite" :mutiItem="mutiItem" @createSite="createSite"
            @changeMutiSelect="changeMutiSelect">
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
            formItem:[{type:'input',label:'name',placeholder:'考勤地点'},{type:'mutiSelect',nameText:'城市',options:[],placeholder:'全部',label:'city'},{type:'button',btnType:'primary',nameText:'搜索'}],
            mutiItem: {right:[{nameText:'添加',className:'el-icon-circle-plus-outline',event:'createSite'}]},
            // searchInfo: {},
        }
    },
    mounted() {
        this.getCity()
    },
    methods: {
        async getCity() {
            try {
                let res = await this.$axios({url:'/es/offices/getCity',method:'get'})
                if(res) {
                    console.log('成功获取城市列表',res)
                    let index = this._.findIndex(this.formItem,item => item.label === 'city')
                    let options = res.map(item=> {
                        return {name:item,id:item}
                    })
                    this.formItem[index].options = options
                }
            } catch(err) {
                console.log(err)
            }
        },
        format: function(cellvalue,property) {
            if(property == 'clockGroup') {
                return cellvalue ? cellvalue.map(item=> item.name).join(';') : '无'
            } else if(property == 'officeDevices') {
                return utils.filterClockType(cellvalue)
            } else {
                return cellvalue
            }
        },
        changeMutiSelect: function(val1,val2) {
            this.$emit('changeMutiSelect',val1,val2)
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
            this.$emit('nextPage',val,this.searchInfo)
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
