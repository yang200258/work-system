<template>
    <div class="deviceinfo-container">
        <div class="tab-content">
            <span>添加打卡设备</span>
            <el-tabs type="border-card" class="tab" :value="tabDeviceName">
                <el-tab-pane :label="item" v-for="(item,i) in tabItem" :key="i" :name="item">
                    <check-style :type="i" @searchDevice="searchDevice"></check-style>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import CheckStyle from '@/components/site/checkStyle'
export default {
    props: {
        tabDeviceName: {type:String},
        tabItem: {type:Array},
    },
    data() {
        return {

        }
    },
    components: {
        CheckStyle
    },
    methods: {
        searchDevice: function(searchInfo) {
            this.$emit('searchDevice',searchInfo)
        },
    }
}
</script>

<style lang="scss" scoped>
.deviceinfo-container {
    .tab-content {
        margin-top: 40px;
        display: flex;
        span {
            white-space: nowrap;
        }
        .tab {
            margin-left: 40px;
            width: 100%;
            min-width: 800px;
        }
    }
}
</style>
