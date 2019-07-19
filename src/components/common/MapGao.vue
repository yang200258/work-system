<template>
    <div class="gaode-map-container">
        <div class="header">
            <div class="serch-key">
                <el-input size="middle" placeholder="请输入地址"  v-model="searchKey" id="output" clearable autocomplete v-if="isShowReset"></el-input>
            </div>
            <div id="map-container" class="map-container" :style="{height:mapHeight + 'px'}" v-loading="loading" element-loading-text="拼命加载地图中" element-loading-spinner="el-icon-loading"></div>
        </div>
        <div class="option">
            <div class="left">
                <div class="left-top">
                    <span>地址名称</span>
                    <el-input size="mini"  v-model="siteInfo.name" @change="changeName"></el-input>
                </div>
                <div class="left-botton">
                    <span>详细地址</span>
                    <el-input size="mini"  v-model="siteInfo.address" readonly></el-input>
                </div>
            </div>
            <div class="right">
                <el-button size="mini" @click.prevent="reset" v-if="isShowReset">重置</el-button>
            </div>
        </div>
    </div>
    
</template>

<script>
import {MapKey,MapCityName} from '@/config/config.js'
import remoteLoad from '@/utils/remoteLoad.js'
import {mapState,mapMutations} from 'vuex'
export default {
    props: {
        isShowReset: {type: Boolean,default: true},
        isDestroy: {type: Boolean,default: false},
        mapHeight: {type:Number,default: 600}
    },
    data() {
        return {
            placeSearch: null,
            poiPicker: null,
            map: null,
            AMapUI: null,
            AMap: null,
            searchKey: '',
            district: '',
            districtinfo:'',
            loading: false,
            marker: null,
        }
    },
   async mounted() {
        if(window.AMap && window.AMapUI && window.AMapUI.loadUI) {
            this.initMap()
        } else  {
            this.loading = true
            await remoteLoad(`https://webapi.amap.com/maps?v=1.4.14&key=${MapKey}`)
            await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
            this.loading = false
            this.initMap()
        }
    },
    watch: {
        isDestroy(val) {
            if(val) {
                this.map.destroy()
            } else {
                this.initMap()
            }
        }
    },
    beforeDestroy() {
        this.map.destroy()
        this.searchKey = ''
    },
    computed:  {
        ...mapState({
            siteInfo: state => state.site.siteInfo
        }),
    },
    methods: {
        ...mapMutations({
            setSiteInfo: 'site/setSiteInfo',
            setInfoName: 'site/setInfoName'
        }),
        /* eslint-disable */
        initMap() {
            let AMapUI = this.AMapUI = window.AMapUI
            let AMap = this.AMap = window.AMap
            let mapConfig = {
                resizeEnable: true,
                cityName: MapCityName,
                zoom: 12
            }
            let map = this.map = new AMap.Map('map-container',mapConfig)
            // 启用工具条
            AMap.plugin(['AMap.ToolBar'], ()=> {
                map.addControl(new AMap.ToolBar({
                    position: {top:'10px',left:'10px'}
                }))
            })
            let siteInfo = this.siteInfo
            if(siteInfo.latitude && siteInfo.longitude) {
                let {latitude,longitude} = siteInfo
                mapConfig.center = [longitude, latitude]
                let marker = this.marker = new AMap.Marker({
                    position: [longitude, latitude],
                    draggable: true,
                    title: siteInfo.name,
                })
                map.add(marker)
                //编辑状态时重新定位点标记
                // maker.on('draggend',res=> {
                //     console.log(res)
                // })
                this.map.setFitView()
            }
            // 加载地图搜索插件
            AMap.service('AMap.PlaceSearch', () => {
                this.placeSearch = new AMap.PlaceSearch({
                    pageSize: 5,
                    pageIndex: 1,
                    citylimit: true,
                    city: MapCityName,
                    map: map,
                    panel: 'search-result'
                })
            })
            //加载PoiPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
            AMapUI.loadUI(['misc/PoiPicker'], PoiPicker=> {
                if(PoiPicker) {
                    let poiPicker = new PoiPicker({
                        input: 'output', //输入框id
                    })
                    //初始化poiPicker
                    this.poiPickerReady(poiPicker)
                }
            })
        },
        poiPickerReady: function(poiPicker) {
            this.poiPicker = poiPicker
            let markerConfig = {
                draggable: true,
            }
            const marker = new AMap.Marker(markerConfig)
            //监听poi选中信息
            poiPicker.on('poiPicked', poiResult=> {
                //用户选中的poi点信息
                console.log('用户选中的poi点信息',poiResult)
                this.formatSiteInfo(poiResult)
                this.searchKey = poiResult.item.name
                marker.setMap(this.map)
                //搜索好后移动点标记重新定位***********
                marker.on('dragend',res => {
                    let {lat,lng} = res.lnglat
                    this.getAddress(poiResult.item.name,lng,lat)
                    return 
                })
                marker.setPosition(poiResult.item.location)
                marker.setTitle(poiResult.item.name)
                
                //设置自适应
                this.map.setFitView()
            })
        },
        reset: function() {
            this.setSiteInfo({})
            this.searchKey = ''
            this.initMap()
        },
        formatSiteInfo: function(poi) {
            let source = poi.source
            let site = poi.item
            let name = site.name
            if(source == 'suggest') {
                let address = site.district + site.address
                let l = site.district.split('市')[0].split('省').length
                let city = l ===2 ? site.district.split('市')[0].split('省')[1] : site.district.split('市')[0].split('省')[0]
                let latitude = site.location.lat
                let longitude = site.location.lng
                this.setSiteInfo({name,address,city,latitude,longitude})
            } else {
                let address = poi.item.pname+poi.item.cityname+poi.item.adname+poi.item.address
                let city = site.cityname
                let latitude = site.location.lat
                let longitude = site.location.lng
                this.setSiteInfo({name,address,city,latitude,longitude})
            }
        },
        //移动点标记时根据经纬度解析详细地址
        getAddress(name,lng,lat) {
            AMap.plugin('AMap.Geocoder', () => {
                let geocoder = new AMap.Geocoder({})
                const lnglat = [lng,lat]
                geocoder.getAddress(lnglat, (status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                        console.log(result)
                        let res = result.regeocode.addressComponent
                        let [address,city,longitude,latitude] = [result.regeocode.formattedAddress,res.city,lng,lat]
                        this.setSiteInfo({name,address,city,latitude,longitude})
                    }
                })
            })
        },
        //修改地址名称
        changeName(val) {
            this.setInfoName(val)
        }
    }
}
</script>

<style lang="scss" scoped>
.gaode-map-container {
    display: flex;
    flex-direction: column;
    .header {
        width: 100%;
        position: relative;
        .serch-key {
            width: 285px;
            position: absolute;
            top: 20px;
            left: 100px;
            z-index: 2;
        }
        .map-container {
            width: 100%;
            height: 500px;
        }
    }
    .option {
        display: flex;
        margin-top: 30px;
        .left {
            display: flex;
            flex-direction: column;
            font-size: 12px;
            >div {
                display: flex;
                align-items: center;
                margin-top: 9px;
                span {
                    white-space: nowrap;
                    display: block;
                    margin-right: 50px;
                }
                .el-input {
                    text-overflow: ellipsis;
                    width: 510px;
                }
            }
        }
        .right {
            position: relative;
            margin-left: 40px;
            .el-button {
                position: absolute;
                bottom: 0;
            }
        }
    }
}
</style>
