<template>
    <div class="deviceinfo-container">
        <div class="tab-content">
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
        // margin-top: 40px;
        display: flex;
        font-size: 12px;
        color: #666;
        span {
            white-space: nowrap;
        }
        .tab {
            width: 1000px;
        }
    }
}
</style>
