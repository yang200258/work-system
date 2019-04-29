<template>
    <div class="container">
        <el-select v-model="data" multiple placeholder="全部" collapse-tags @change="changeSelect"  size="mini">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    data() {
        return {
            oldOptions: [],
        }
    },
    props:['data','options'],
    methods: {
        changeSelect: function(val) {
            console.log('val',val)
            let allValues = []
            //保留所有值
            for (let item of this.options) {
                allValues.push(item.value)
            }
            console.log('allValues',allValues);
            // 用来储存上一次的值，可以进行对比
            const oldVal = this.oldOptions.length === 1 ? [] : this.oldOptions[1]
            console.log('oldVal',oldVal);
            // 若是全部选择
            if (val.includes('all')) this.data = allValues
            // 取消全部选中  上次有 当前没有 表示取消全选
            if (oldVal.includes('all') && !val.includes('all')) this.data = []
            // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
            // 新老数据都有全部选中
            if (oldVal.includes('all') && val.includes('all')) {
                const index = val.indexOf('all')
                val.splice(index, 1) // 排除全选选项
                this.data = val
            }
            //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
            if (!oldVal.includes('all') && !val.includes('all')) {
                console.log(11)
                if (val.length === allValues.length - 1) this.data = ['all'].concat(val)
            }
            //储存当前最后的结果 作为下次的老数据 
            this.oldOptions[1] = this.data
        },
    }
}
</script>

<style lang="scss" scoped>

</style>
