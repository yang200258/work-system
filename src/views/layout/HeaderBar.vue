<template>
    <div class="sys-header">
        <div class="logo">
            <slot name="logo"></slot>
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
    }
}
</script>

<style lang="scss" scoped>
    .sys-header {
        position: fixed;
        width: 100%;
        height: 60px;
        background-color: #409EFF;
        z-index: 1000;
        .logo {
            float: left;
            height: 60px;
            line-height: 60px;
            padding-left: 20px;
            // color: $headerColor;
            font-size: 20px;
        }
    }
    @media screen and (max-width: 800px) {
        .logo {
            display: none;
        }
    }
</style>
