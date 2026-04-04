<template>
  <MapContainer
    ref="mapRef"
    :center="[ 34.26, 108.94]"
    :zoom="8"
    @ready="onMapReady"
    style="width: 100%; height: 100%"
    v-model:mapType="currentMapType"
    :apiKey="MAP_KEY"
  >
    <!-- 地图切换器 -->
    <MapSwitcher v-model="currentMapType" position="bottomright" />

    <!-- 复位按钮 -->
    <MapReset position="topright" />

    <!-- 全屏按钮 -->
    <MapFullscreen position="topright" style="top: 44px" />

    <!-- 单个标记 -->
   <MapMarker :markers="[{ latLng: [ 34.26, 108.94], popup: '西安' }]" />

    <!-- 聚合点 -->
    <MapCluster :markers="clusterPoints" />

    <!-- 热力图 -->
    <MapHeat :points="heatPoints" />

    <!-- 绘制工具 -->
    <MapDraw />

    <!-- 西安区域覆盖 (GeoJSON) -->
    <MapGeoJSON 
      v-if="xianBoundary" 
      :data="xianBoundary" 
      :options="boundaryStyle"
    />
  </MapContainer>

  <button @click="flyToShijiazhuang" style="position:absolute;top:10px;left:10px;z-index:1000">
    飞到石家庄
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  MapContainer,
  MapMarker,
  MapCluster,
  MapHeat,
  MapDraw,
  MapGeoJSON,
  MapSwitcher,
  MapReset,
  MapFullscreen,
  type MarkerItem,
  type MapType
} from '@nexus/ui'
import shanGBoundary from './610000.geoJson?raw'
const MAP_KEY = 'df3ff37e0f577ada3ea370eea158425c'
const mapRef = ref<InstanceType<typeof MapContainer> | null>(null)
const currentMapType = ref<MapType>('tdt')

// 模拟西安边界数据 (GeoJSON)
const xianBoundary = JSON.parse(shanGBoundary.replace(/^\uFEFF/, ''))
// 覆盖层样式
const boundaryStyle: L.GeoJSONOptions = {
  style: {
    color: '#ff0000',
    weight: 2,
    fillColor: '#409eff',
    fillOpacity: 0.3
  }
}

const onMapReady = (map: L.Map) => {
  console.log('地图 ready', map)
}

// 聚合示例数据
const clusterPoints: MarkerItem[] = [
  { latLng: [ 34.26, 108.94], popup: '西安1' },
  { latLng: [ 34.27, 108.95], popup: '西安2' },
  { latLng: [ 34.28, 108.96], popup: '西安3' }
]

// 热力图示例数据
const heatPoints: [number, number, number][] = [
  [ 34.26, 108.94, 0.8], 
  [ 34.27, 108.95, 0.5], 
  [ 34.28, 108.96, 0.3]
]

// flyTo 示例
const flyToShijiazhuang = () => {
  mapRef.value?.flyTo([38.042, 114.514], 10)
}
</script>

<style scoped>
button {
  padding: 6px 12px;
  background-color: #409eff;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}
button:hover {
  background-color: #66b1ff;
}
</style>