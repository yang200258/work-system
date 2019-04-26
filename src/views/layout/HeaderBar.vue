<template>
    <div class="sys-header">
        <div class="logo" @click.prevent="goHome">
            <!-- <slot name="logo"></slot> -->
            <img src="@/assets/images/logo.png" alt="">
            <p>EasySite</p>
        </div>
        <slot name="topnav"></slot>
        <article class="userInfo">
            
        </article>
    </div>
    
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    data() {
        return {
            
        }
    },
    computed: {
        ...mapState({
            username: state => state.user.user.name,
        })
    },
    methods: {
        ...mapActions({
            sysLogout: 'auth/logout',
        }),
        logout() {
            this.sysLogout().then(() => {
                this.$router.push('/login')
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
        position: fixed;
        // display: flex;
        // flex-wrap: nowrap;
        width: 100%;
        height: 60px;
        background-color: #384367;
        z-index: 1000;
        max-height: 60px;
        .logo {
            float: left;
            display: flex;
            height: 60px;
            line-height: 60px;
            padding-left: 20px;
            // color: $headerColor;
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
    }
</style>
