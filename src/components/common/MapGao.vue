<template>
    <div>
        
    </div>
</template>

<script>
import {MapKey} from '@/config/config.js'
export default {
    data() {
        return {

        }
    },
    async created() {
        if(window.AMap && window.AMapUI) {
            this.initMap()
        } else {
            await remoteLoad(`http://webapi.amap.com/maps?v=1.3&key=${MapKey}`)
            await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
            this.initMap()
        }
    },
    methods: {
        initMap: function() {
            
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
