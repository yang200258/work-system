<template>
    <div class="optionsite-container"> 
        <el-tabs v-model="activeName">
            <el-tab-pane label="添加地点信息" name="optionSite">
                <site-info :isShowReset="isShowReset"></site-info>
            </el-tab-pane>
            <el-tab-pane label="添加打卡设备" name="optionDevice" lazy :disabled="(optionSiteId || !isDisable) ? false : true">
                <device-info :tabDeviceName="tabDeviceName" :tabItem="tabItem" @searchDevice="searchDevice" ></device-info>
            </el-tab-pane>
        </el-tabs>
        <div class="footer">
            <el-button type="primary" size="medium" @click.prevent="submitCreate">保存</el-button>
        </div>
    </div>
</template>

<script>
import SiteInfo from '@/components/site/siteInfo'
import DeviceInfo from '@/components/site/deviceInfo'
import {mapState,mapMutations} from 'vuex'
export default {
    props: {
        // isDisable: {type:Boolean,default: true},
        // isInit: {type:Boolean},
        isShowReset: {type:Boolean,default: true},
        optionSiteId: {type:Number},
        
    },
    data() {
        return {
            officeId: null,   //添加或编辑的考勤地点ID
            tabItem: ['蓝牙','WIFI'],
            tabDeviceName: '蓝牙',
            activeName: 'optionSite',
            isDisable: true,
        }
    },
    mounted() {
        //获取可选设备列表
        this.queryDevice()
    },
    computed: {
        ...mapState({
            siteInfo: state => state.site.siteInfo,   //地点信息
            equips: state => state.site.equips,     // 设备列表
            addEquips: state => state.site.addEquips,   //已添加设备
            inialDeviceId: state => state.site.inialDeviceId    //记录初始状态时的已添加设备
        })
    },
    methods: {
        ...mapMutations({
            setEquips: 'site/setEquips',
            setAddEquips: 'site/setEquips',
            setInialDeviceId: 'site/setEquips',
            clearSiteInfo: 'site/clearSiteInfo'
        }),
        //点击保存时操作
        submitCreate: function() {
            if(this.activeName == 'optionSite') {
                this.optionSite(this.optionSiteId)
            } else {
                this.optionDevice()
            }
        },
        //操作考勤地点---------新增id=0编辑id=1
        optionSite: function(id=0) {
            this.siteInfo.id = id
            this.$axios({
                url: '/es/offices/saveOffice',
                method: 'post',
                data: this.siteInfo
            }).then(res=> {
                console.log('成功操作考勤地点',res);
                if(res) {
                    if(!id) this.$message.success('添加考勤地点成功')
                    if(id) this.$message.success('编辑考勤地点成功')
                    this.officeId = res.id
                    this.activeName = 'optionDevice'
                    this.isDisable = false
                }
            }).catch(err=> {
                console.log(err);
            })
        },
        //添加打卡设备
        optionDevice: function() {
            let officeId = this.officeId
            let {newId,delId} = this.contrastDevice(this.inialDeviceId,this.addEquips)       //获取到的新增设备和减少设备的id，待接口
            this.$axios({
                url: '/es/offices/addDevice',
                method: 'post',
                data: {deviceId:newId,officeId}
            }).then(res=> {
                console.log('添加设备成功',res)
                if(res) {
                    // this.$message.success('设备操作成功')
                    this.$axios({
                        url: '/es/offices/delDevice',
                        method: 'post',
                        data: {deviceId:delId,officeId}
                    }).then(delRes=> {
                        console.log('删除设备成功',delRes)
                        if(delRes) {
                            this.$message.success('保存设备成功！')
                            //编辑或新增成功后清楚数据
                            this.clearSiteInfo()
                            this.$router.push('clocksite')
                        }
                    })
                    
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //搜索设备
        searchDevice: function(searchInfo) {
            this.queryDevice(searchInfo,'',1,20)
        },
        //查询设备
        queryDevice: function(name='',type='',page=1,size=20) {
            this.$axios({
                url: `/es/devices/_search?page=${page}&size=${size}`,
                method: 'post',
                data: {name,type}
            }).then(res=> {
                console.log('查询到的设备',res)
                if(res) {
                    this.setEquips(res.content)
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //编辑添加设备时对比初始状态的已添加设备,返回新增、删除的设备id
        contrastDevice: function(inialDeviceId,finalDevice) {
            let finalDeviceId = finalDevice.map( item => item.id)
            let newId = this._.difference(finalDeviceId,inialDeviceId)
            let delId = this._.difference(inialDeviceId,finalDeviceId)
            return {newId,delId}
        },
        
        
    },
    components: {
        SiteInfo,DeviceInfo
    },
    deactivated() {
        this.activeName = 'optionSite'
        this.isDisable = true
    },
}
</script>

<style lang="scss" scoped>
    .optionsite-container {
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
