<template>
    <div class="sitetag-container">
        <a @click.prevent="goSiteInfo">{{siteData.city}}-{{siteData.site}}-（{{siteData.type}}）</a>
        <img src="../../assets/images/del.png" alt="" @click="delsite">
    </div>
</template>

<script>
export default {
    props: {
        siteData: {type: Object}
    },
    data() {
        return {

        }
    },
    methods: {
        delsite: function() {
          this.$emit('delsite')
        },
        goSiteInfo: function() {
            
        }
    }
}
</script>


<style lang="scss" scoped>
    .sitetag-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        width: 320px;
        border-bottom: 1px dashed #ccc;
        a {
            color: #409EFF;
            font-family: 'PingFangSC-Regular', 'PingFang SC';
            font-size: 13px;
            cursor: pointer;
        }
        img {
            width:30px;
            height: 30px;
        }
    }
</style>

