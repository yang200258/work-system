<template>
    <div class="tag-nav">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in tagNavList"  :key="index" :to="item.path">{{item.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>

export default {
    data(){
        return {
            defaultPage: '/home',
            tagNavList: [],
        }
    },
    mounted(){
        // 首次加载时将默认页面加入缓存
        this.addTagNav()
    },
    watch: {
        $route(){
            this.addTagNav()
            // this.scrollToCurTag()
        }
    },
    methods: {
        addTagNav(){
            console.log('-----------',this.$route)
            if(this.$route.name === 'home') return this.tagNavList = []
            let matched = this.$route.matched.filter(item => item.name)
            // const first = matched[0];
            matched = [].concat(matched)
            this.tagNavList = matched
        },
        isActive(item){
            return item.path === this.$route.path
        },
    },
}
</script>

<style lang="scss" scoped>
    .tag-nav {
        padding-left: 20px;
        margin-bottom: 20px;
        height: 30px;
        font-size: 14px;
    }
</style>
