<template>
    <div class="wrapper">
        <template v-if="layout == 'top'">
            <header-bar>
                <template slot="topnav">
                    <nav-bar :layout="'top'"></nav-bar>
                </template>
            </header-bar>
        </template>
        <div class="content" :class="layout">
            <tag-nav></tag-nav>
            <keep-alive :include="tagNavList">
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import HeaderBar from './HeaderBar'
import NavBar from './NavBar'
import TagNav from './TagNav'

export default {
    computed: {
        tagNavList(){
            return this.$store.state.tagNav.cachedPageName
        }
    },
    components:{
        HeaderBar,
        NavBar,
        TagNav
    }
}
</script>

<style lang="scss">
@import '@/assets/css/theme-dark.scss';
@import '@/assets/css/theme-default.scss';
@import '@/assets/css/theme/dark.scss';
@import '@/assets/css/theme/default.scss';
  @import '@/assets/css/page/login.scss';
</style>


