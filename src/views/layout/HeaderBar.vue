<template>
    <div class="sys-header">
        <div class="logo">
            <slot name="logo"></slot>
        </div>
        <slot name="topnav"></slot>
        <article class="userInfo">
            <img src="" alt="">
            <img src="" alt="">
            <img src="" alt="">
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
            username: state => state.user.name,
            lang: state => state.lang
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