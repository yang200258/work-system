<template>
    <div class="gaode-map-container">
        <div class="search">
            <div class="serch-key">
                <el-input size="middle" placeholder="请输入地址"  v-model="searchKey" id="output" clearable autocomplete></el-input>
            </div>
            <div id="search-result" v-show="searchKey" class="result">
            </div>
        </div>
        <div id="map-container" class="map-container">
            正在加载地图 ...
        </div>
        <div class="option">
            <div class="left">
                <div class="left-top">
                    <span>地址名称</span>
                    <el-input size="middle" v-model="poi.name" readonly></el-input>
                </div>
                <div class="left-botton">
                    <span>详细地址</span>
                    <span v-if="!poi">---</span>
                    <span v-else>{{poi.district}}</span>
                </div>
            </div>
            <div class="right">
                <el-button size="mini" @click.prevent="reset">重置</el-button>
            </div>
        </div>
    </div>
    
</template>

<script>
import {MapKey,MapCityName} from '@/config/config.js'
import remoteLoad from '@/utils/remoteLoad.js'
export default {
    props:{
        lat: {type: Number},
        lng: {type: Number}
    },
    data() {
        return {
            searchKey: '',
            placeSearch: null,
            poiPicker: null,
            map: null,
            AMapUI: null,
            AMap: null,
            district: '',
            districtinfo:'',
            poi: {}
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
        if(window.AMap && window.AMapUI) {
            this.initMap()
        } else {
            await remoteLoad(`http://webapi.amap.com/maps?v=1.3&key=${MapKey}`)
            await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
            this.initMap()
        }
    },
    beforeDestroy() {
        this.map = null
    },
    methods: {
        /* eslint-disable */
        initMap: function() {
            let AMapUI = this.AMapUI = window.AMapUI
            let AMap = this.AMap = window.AMap
            let mapConfig = {
                resizeEnable: true,
                cityName: MapCityName,
                zoom: 10
            }
            if(this.lat &&this.lng) {
                mapConfig.center = [this.lng, this.lat]
            }
            let map = this.map = new AMap.Map('map-container',mapConfig)
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
            // 启用工具条
            AMap.plugin(['AMap.ToolBar'], ()=> {
                map.addControl(new AMap.ToolBar({
                    position: {top:'10px',left:'10px'}
                }))
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
                marker.setPosition(res.lnglat)
            })
            //监听poi选中信息
            poiPicker.on('poiPicked', poiResult=> {
                //用户选中的poi点信息
                console.log('用户选中的poi点信息',poiResult)
                let poi = this.poi = poiResult.item
                this.searchKey = poiResult.item.name
                marker.setMap(this.map)
                marker.setPosition(poi.location)
                marker.setTitle(poi.name)
                //设置自适应
                this.map.setFitView()
            })
        },
        reset: function() {
            this.poi = {}
            this.searchKey = ''
        },
        add: function() {
            this.$emit('add',this.poi)
        }
    }
}
</script>

<style lang="scss" scoped>
.gaode-map-container {
    min-width: 500px; 
    min-height: 300px; 
    position: relative; 
    .search {
        position: absolute;
        top: 20px; 
        left: 80px; 
        width: 285px; 
        z-index: 1;
        .search-result {
            position: relative;
            right: 0;
            top: 30px;
            max-height: 300px; 
            overflow: auto; 
        }
    }
    .map-container {
        width: 100%;
        // height: 100%;
        min-height: 300px; 
    }
    .option {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
            margin-top: 30px;
            .el-button {
                &:first-child {
                    margin-right: 40px;
                }
            }
        }
    }
}
</style>
