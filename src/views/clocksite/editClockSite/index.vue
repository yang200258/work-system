<template>
    <div class="check-container"> 
        <option-site :optionSiteId="optionSiteId"></option-site>
    </div>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'
import OptionSite from '@/components/site/optionSite'
export default {
    data() {
        return {
            optionSiteId: null,       //操作新增考勤地点还是编辑考勤地点
        }
    },
    mounted() {
        //获取初始对应地点已添加设备
        if(this.$route.params.officeId) {
            this.getInialDeviceId(this.$route.params.officeId)
            this.optionSiteId = this.$route.params.officeId
        }
    },
    computed: {
        ...mapState({
            siteInfo: state => state.site.siteInfo,
            inialDeviceId: state => state.site.inialDeviceId
        })
    },
    methods: {
        ...mapMutations({
            setInialDeviceId: 'site/setInialDeviceId',
            setAddEquips: 'site/setAddEquips'
        }),
        ...mapActions({
            getInialDevice: 'site/getInialDevice'
        }),
        //获取初始对应地点已添加设备
        getInialDeviceId: function(officeId) {
            // let officeId = this.siteInfo.id
            let [page,size] = [1,20]
            let requestData = {page,size,officeId}
            this.getInialDevice(requestData)
        }
    },
    components: {
        OptionSite
    }
}
</script>

<style lang="scss" scoped>
    .check-container {
        padding: 0 40px;
        display: flex;
        flex-direction: column;
        .footer {
            display: flex;
            justify-content: center;
            margin: 40px 0;
        }
    }
</style>
