<template>
    <div class="sys-header">
        <div class="logo" @click.prevent="goHome">
            <!-- <slot name="logo"></slot> -->
            <img src="@/assets/images/logo.png" alt="">
            <p>EasySite</p>
        </div>
        <slot name="topnav"></slot>
        <!-- <div class="userInfo">
            <img @click.prevent="logout" src="@/assets/images/logout.png" alt="">
        </div> -->
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
    .sys-header {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        z-index: 1000;
        .logo {
            float: left;
            display: flex;
            height: 60px;
            line-height: 60px;
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
                color: #FFFFFF;
                font-family: Arial;
                font-weight: 700;
                z-index: 9999;
            }
        }
        .userInfo {
            height: 60px;
            display: flex;
            align-items: center;
            color: red;
            position: absolute;
            right: 5%;
            img {
                cursor: pointer;
                width: 24px;
            }
        }
    }
</style>
