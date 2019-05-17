<template>
    <div class="top-nav">
        <el-menu router ref="navbar" :default-active="defActive" mode="horizontal" menu-trigger="hover" @select="selectMenu" @open="openMenu" @close="closeMenu" unique-opened background-color="#384367" text-color="#fff" active-text-color="#ffd04b">
            <nav-bar-item v-for="(item, n) in navList" :item="item" :key="n" :navIndex="String(n)"></nav-bar-item>
        </el-menu>
        <div v-show="navBgShow" class="full-screen-navBg" @click.self="closeAll"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import NavBarItem from './NavBarItem'

export default {
    data() {
        return {
            navBgShow: false
        }
    },
    computed:{
        ...mapState({
            navList: state => state.auth.navlist
        }),
        defActive(){
            return this.$route.path
        },
    },
    watch: {
        // 当通过TagNav来激活页面时也执行一次selectMenu
        $route(){
            let path = this.$route.path
            if(path.includes('home')) {
                this.$refs.navbar.activeIndex = ''
                return
            }
            // let indexPath = this.$refs.navbar.items[path].indexPath
            // this.selectMenu(path, indexPath)
        }
    },
    methods: {
        // 选择菜单激活
        selectMenu(index, indexPath){
            /**
             * 在选择父级菜单时自动关闭其下所有子菜单
             * 选择时获取点击菜单的父级index，并计算得到该index在已打开菜单中的索引值，
             * 关闭位于当前打开菜单中该索引值之后的全部菜单
             */
            let openedMenus = this.$refs.navbar.openedMenus
            let openMenuList
            // 如果点击的是二级菜单，则获取其后已经打开的菜单
            if(indexPath.length > 1){
                let parentPath = indexPath[indexPath.length-2]
                openMenuList = openedMenus.slice(openedMenus.indexOf(parentPath)+1)
            } else{
                openMenuList = openedMenus
            }
            
            // 关闭菜单
            openMenuList = openMenuList.reverse()
            openMenuList.forEach((ele) => {
                this.$refs.navbar.closeMenu(ele)
            })
            this.navBgShow = false
        },
        openMenu(){
            this.navBgShow = true
        },
        closeMenu(){
            this.navBgShow = false
        },
        closeAll(){
            console.log("背景遮罩图")
            let openMenu = this.$refs.navbar.openedMenus.concat([])
            openMenu = openMenu.reverse()
            openMenu.forEach((ele) => {
                this.$refs.navbar.closeMenu(ele)
            })
            this.navBgShow = false
        }
    },
    components: { NavBarItem }
}
</script>

<style lang="scss">
    .top-nav {
        display: flex;
        flex-wrap: nowrap;
        max-height: 60px;
        .el-menu--horizontal {
            display: flex;
            flex-wrap: nowrap;
            &>.el-submenu .el-submenu__icon-arrow {
                display: none;
            }
        }
        .el-submenu .el-menu-item {
            min-width: 0;
        }
        
        .full-screen-navBg {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            z-index: 5;
        }
    }
</style>
