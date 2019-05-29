<template>
    <div class="sys-header">
        <div class="logo" @click.prevent="goHome">
            <img src="@/assets/images/logo.png" alt="">
            <p>EasySite</p>
        </div>
        <slot name="topnav"></slot>
        <div class="userInfo">
            <img @click.prevent="logout" src="@/assets/images/logout.png" alt="">
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
        logout() {
            this.sysLogout().then(() => {
                this.$router.push('/login')
                ls.clear()
            })
        },
        goHome: function() {
            this.$router.push('home')
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
        z-index: 1000;
        color: #000;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        .logo {
            float: left;
            display: flex;
            height: $headBarHeight;
            line-height: $headBarHeight;
            padding-left: 20px;
            font-size: 20px;
            margin-right: 6%;
            &:hover {
                cursor: pointer;
            }
            img {
                display: block;
                width: 100%;
                height: 40px;
                z-index: 9999;
                margin: auto;
                margin-right: 10px;
            }
            p {
                font-size: 24px;
                font-weight: 700;
                z-index: 9999;
            }
        }
        .userInfo {
            height: 60px;
            display: flex;
            align-items: center;
            position: absolute;
            top: 0;
            right: 5%;
            img {
                cursor: pointer;
                width: 24px;
            }
        }
    }
</style>
