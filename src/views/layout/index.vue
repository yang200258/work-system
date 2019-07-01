<template>
    <div class="wrapper">
        <div class="headerbar">
            <template>
                <header-bar class="header-bar">
                    <template slot="topnav">
                        <nav-bar ></nav-bar>
                    </template>
                </header-bar>
            </template>
        </div>
        <div class="tag">
            <tag-nav></tag-nav>
        </div>
        <div class="content">
            <!-- <keep-alive> -->
                <router-view></router-view>
            <!-- </keep-alive> -->
        </div>
    </div>
</template>

<script>
import HeaderBar from './HeaderBar'
import NavBar from './NavBar'
import TagNav from './TagNav'

export default {
    computed: {
        // tagNavList(){
        //     return this.$store.state.tagNav.cachedPageName
        // }
    },
    components:{
        HeaderBar,
        NavBar,
        TagNav
    }
}
</script>

<style lang="scss">
@import '@/assets/style/headBar.scss';
.wrapper {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: $headBarHeight auto;
    .header-bar {
        min-width: 560px;
        position: fixed;
        top: 0;
        max-height: $headBarHeight;
        width: 100%;
    }
    .content {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
    }
}

</style>


