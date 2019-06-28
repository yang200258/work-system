<template>
    <div class="mutiselect-container">
        <el-popover placement="bottom-start" width="100" @hide="popoverHide" trigger="click">
            <el-scrollbar>
                <el-checkbox-group v-model="selectGroup" style="display:flex;flex-direction: column;height:100px;" @change="change">
                    <el-checkbox v-for="(item,i) in options" :key="i" :label="item.id" style="margin-top:4px;">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-scrollbar>
            <div class="choose-option" slot="reference">
                <p style="margin-right:10px">{{nameText}}:</p>
                <p v-if="chooseContent.length === 0" style="margin-right:4px">全部</p>
                <div class="choose-content">
                    <span v-for="(item,i) in chooseContent" :key="i">{{item.name}}</span>
                </div>
                <div class="iconfont icon-sanjiao"></div>
            </div>
        </el-popover>
    </div>
</template>

<script>
export default {
    props: {
        nameText: {type: String},
        // mutiData: {type:Array},
        options: {type:Array},
        //popover隐藏时触发
        popoverHide: {
            type: Function,
            default: function () { }
        },
    },
    data() {
        return {
            selectGroup: [],
        }
    },
    methods:{
        change: function() {
            this.$emit('changeMutiSelect',this.selectGroup)
        }
    },
    computed: {
        chooseContent: function() {
            const list = []
            this.options.forEach(item=> {
                this.selectGroup.forEach(v=> {
                    if(item.id === v) {
                        list.push(item)
                    }
                })
            })
            return list
        },
    },
}
</script>


<style lang="scss" scoped>
    .mutiselect-container {
        font-size:12px;
        color: #444853;
        .choose-option {
            display: flex;
            align-items: center;
            &:hover {
                cursor: pointer;
            }
            p {
                white-space: nowrap;
            }
            .choose-content {
                display: flex;
                align-items: center;
                span {
                    white-space: nowrap;
                    background-color: #E9EEF4;
                    display: block;
                    height: 24px;
                    text-align: center;
                    line-height: 24px;
                    border-radius: 4px;
                    margin: 0 4px;
                    padding: 0 4px;
                }
            }
        }
    }
</style>
