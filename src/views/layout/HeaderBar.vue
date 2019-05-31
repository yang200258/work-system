<template>
    <div class="sys-header">
        <div class="logo" @click.prevent="goHome">
            <img src="@/assets/images/logo.png" alt="">
        </div>
        <slot name="topnav"></slot>
        <div class="userInfo">
            <el-dropdown>
                <span class="el-dropdown-link setting">
                    <i class="iconfont icon-shezhi"></i>
                    <i class="iconfont icon-sanjiao"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>设置1</el-dropdown-item>
                    <el-dropdown-item>设置2</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="avaterOption">
                <span class="el-dropdown-link avater">
                    <img src="@/assets/images/avater.png" alt="">
                    <i class="iconfont icon-sanjiao"></i>
                </span>
                <el-dropdown-menu slot="dropdown" divided>
                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
    
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ls from '@/utils/localStorage'
export default {
    data() {
        return {
            
        }
    },
    computed: {
        ...mapState({
            username: state => state.user.user.name,
        }),
    },
    methods: {
        ...mapActions({
            sysLogout: 'auth/logout',
        }),
        avaterOption: function(command) {
            switch(command) {
                case 'logout':
                    this.logout()
                    break
            }
        },
        logout() {
            this.sysLogout().then(() => {
                this.$router.push('/login')
                ls.clear()
            })
        },
        goHome: function() {
            this.$router.push('/home')
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/style/headBar.scss';
    .sys-header {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        z-index: 999;
        color: #000;
        background-color: #fff;
        box-shadow: 0 2px 22px rgba(0, 0, 0, 0.2);
        .logo {
            display: flex;
            height: $headBarHeight;
            line-height: $headBarHeight;
            padding-left: 34px;
            margin-right: 102px;
            &:hover {
                cursor: pointer;
            }
            img {
                display: block;
                width: 124px;
                height: 30px;
                margin: auto;
            }
        }
        .userInfo {
            height: $headBarHeight;
            display: flex;
            align-items: center;
            position: absolute;
            top: 0;
            right: 28px;
            overflow: hidden;
            background-color: #fff;
            .setting {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                height: $headBarHeight;
                width: $headBarHeight;
                .icon-shezhi {
                    font-size: 24px;
                }
                .icon-sanjiao {
                    color: #666;
                }
                &:hover {
                    .icon-sanjiao {
                        color: #409eff;
                    }
                    color: #409eff;
                }
            }
            .avater {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 22px;
                img {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                }
                .icon-sanjiao {
                    color: #666;
                }
                &:hover {
                    .icon-sanjiao {
                        color: #409eff;
                    }
                }
            }
        }
    }
</style>
