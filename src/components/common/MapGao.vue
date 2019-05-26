<template>
    <div class="gaode-map-container">
        <div class="header">
            <div class="serch-key">
                <el-input size="middle" placeholder="请输入地址"  v-model="searchKey" id="output" clearable autocomplete v-if="isShowReset"></el-input>
            </div>
            <!-- <div id="search-result" v-show="searchKey" class="result"></div> -->
            <div id="map-container" class="map-container" v-loading="loading" element-loading-text="拼命加载地图中" element-loading-spinner="el-icon-loading"></div>
        </div>
        <div class="option">
            <div class="left">
                <div class="left-top">
                    <span>地址名称</span>
                    <el-input size="middle"  v-model="siteInfo.name" readonly></el-input>
                </div>
                <div class="left-botton">
                    <span>详细地址</span>
                    <span v-if="!siteInfo.address">---</span>
                    <span v-else>{{siteInfo.address}}</span>
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
        isShowReset: {type: Boolean,default: true}
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
        }
    },
    watch: {
        searchKey () {
            if (this.searchKey === '') {
                this.placeSearch.clear()
            }
        }
    },
    async created() {
        if(window.AMap && window.AMapUI && window.AMapUI.loadUI) {
            this.initMap()
        } else {
            this.loading = true
            await remoteLoad(`https://webapi.amap.com/maps?v=1.4.14&key=${MapKey}`)
            await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
            this.loading = false
            this.initMap()
        }
    },
    beforeDestroy() {
        console.log('xiaohui');
    },
    computed:  {
        ...mapState({
            siteInfo: state => state.site.siteInfo
        }),
    },
    methods: {
        ...mapMutations({
            setSiteInfo: 'site/setSiteInfo'
        }),
        /* eslint-disable */
        initMap: function() {
            let AMapUI = this.AMapUI = window.AMapUI
            let AMap = this.AMap = window.AMap
            let mapConfig = {
                resizeEnable: true,
                cityName: MapCityName,
                zoom: 10
            }
            let map = this.map = new AMap.Map('map-container',mapConfig)
            // 启用工具条
            AMap.plugin(['AMap.ToolBar'], ()=> {
                map.addControl(new AMap.ToolBar({
                    position: {top:'10px',left:'10px'}
                }))
            })
            let siteInfo = this.siteInfo
            if(siteInfo.latitude &&siteInfo.longitude) {
                let {latitude,longitude} = siteInfo
                mapConfig.center = [longitude, latitude]
                const marker = new AMap.Marker({
                    position: [longitude, latitude]
                })
                map.add(marker)
                this.map.setFitView()
                return
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
                let poiPicker = new PoiPicker({
                    input: 'output', //输入框id
                })
                //初始化poiPicker
                this.poiPickerReady(poiPicker);
            })
        },
        poiPickerReady: function(poiPicker) {
            this.poiPicker = poiPicker
            let markerConfig = {
                draggable: true,
            }
            const marker = new AMap.Marker(markerConfig)
            marker.on('dragend',res=> {
                console.log(res)
                marker.setPosition(res.lnglat)
            })
            //监听poi选中信息
            poiPicker.on('poiPicked', poiResult=> {
                //用户选中的poi点信息
                console.log('用户选中的poi点信息',poiResult)
                this.formatSiteInfo(poiResult)
                this.searchKey = poiResult.item.name
                marker.setMap(this.map)
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
                let city = site.district.split('市')[0].split('省')[1]
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
            height: 600px;
        }
    }
    .option {
        display: flex;
        // align-items: center;
        .left {
            display: flex;
            flex-direction: column;
            >div {
                display: flex;
                align-items: center;
                margin-top: 30px;
                span {
                    white-space: nowrap;
                    display: block;
                    margin-right: 50px;
                }
                .el-input {
                    overflow: hidden;
                    text-overflow: ellipsis;
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
