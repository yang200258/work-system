<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {

    }
  },
  // TODO: 全局状态加载及变更。请根据实际情况改写
    beforeMount(){
        // 首次加载/刷新时判断当前是否在登录状态
        if (!Cookies.get('isLogin')) {
            console.log("重新登录")
            this.$store.dispatch('auth/relogin')
        } else {
            console.log('刷新*********************************');
            this.$store.dispatch('auth/getNavlist')
        }
    },
}
</script>
<style lang="scss">
@import './assets/style/normalize.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  margin: 0;
  height: 100%;
}
</style>
