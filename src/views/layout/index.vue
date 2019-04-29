<template>
    <div class="wrapper">
        <template>
            <header-bar class="header-bar">
                <template slot="topnav">
                    <nav-bar ></nav-bar>
                </template>
            </header-bar>
        </template>
        <div class="content">
            <tag-nav></tag-nav>
            <keep-alive>
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
.wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    .header-bar {
        height: 60px;
        min-width: 560px;
        position: fixed;
    }
    .content {
        padding-top: 80px;
        height: 100%;
    }
}

</style>


