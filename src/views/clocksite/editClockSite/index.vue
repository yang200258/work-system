<template>
    <div class="check-container"> 
        <option-site :activeName="activeName" :optionSiteId="optionSiteId" :isDisable="isDisable"></option-site>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import OptionSite from '@/components/site/optionSite'
export default {
    data() {
        return {
            activeName: 'addSite',
            isDisable: false,
            optionSiteId: 1,       //操作新增考勤地点还是编辑考勤地点
        }
    },
    mounted() {
        //获取初始对应地点已添加设备
        this.getInialDevice()
    },
    computed: {
        ...mapState({
            siteIndo: state => state.site.siteInfo,
            inialDeviceId: state => state.site.inialDeviceId
        })
    },
    methods: {
        ...mapMutations({
            setInialDeviceId: 'site/setInialDeviceId'
        }),
        //获取初始对应地点已添加设备
        getInialDevice: function() {
            let {officeId} = this.siteIndo
            this.$axios({
                url: '',
                method: 'post',
                data: {officeId}
            }).then(res=> {
                console.log('获取考勤地点对应已添加设备',res);
                if(res) {
                    this.setAddEquips(res)
                    const deviceid = res.map( item=> item.id)
                    this.setInialDeviceId(deviceid)
                }
            }).catch(err=> {
                console.log(err)
            })
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
