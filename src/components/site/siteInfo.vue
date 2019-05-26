<template>
    <div class="siteinfo-container">
        <p>选择地址</p>
        <map-gao class="gao-map" :isShowReset="isShowReset"> </map-gao>
    </div>
</template>

<script>
import MapGao from '@/components/common/MapGao'
export default {
    props: {
        isShowReset: {type: Boolean}
    },
    data() {
        return {

        }
    },
    components: {
        MapGao
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
.siteinfo-container {
    p {
        font-size: 20px;
        color: #ccc;
    }
    .gao-map {
        margin-top: 20px;
        width: 100%;
        height: 100%;
    }
}
</style>
