<template>
    <div class="tag-nav">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }" :class="{active:isActive}">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in tagNavList"  :key="index" :to="item.path">{{item.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>

export default {
    data(){
        return {
            tagNavList: [],
        }
    },
    mounted(){
        // 首次加载时将默认页面加入缓存
        this.addTagNav()
    },
    watch: {
        $route(to, from){
            this.addTagNav(to, from)
            // this.scrollToCurTag()
        }
    },
    methods: {
        addTagNav(to, from){
            if(this.$route.name === 'home') return this.tagNavList = []
            let matched = this.$route.matched.filter(item => item.name)
            matched = [].concat(matched)
            if(to && from && to.fullPath.includes(from.fullPath)) {
                this.tagNavList.push(matched[0])
            } else {
                this.tagNavList = matched
            }
        },
        isActive(item){
            return item.path === this.$route.path
        },
    },
}
</script>

<style lang="scss" scoped>
    .tag-nav {
        padding: 24px 48px 24px;
        width: 100%;
        font-size: 14px;
        background-color: #fff;
        z-index: 9999;
    }
</style>
