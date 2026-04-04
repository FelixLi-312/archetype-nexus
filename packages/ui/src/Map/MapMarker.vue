/**
 * 地图标记组件
 * 用于在地图上添加标记（marker）
 * 支持自定义标记项配置和事件绑定
 */
<template></template>
<script setup lang="ts">
import { inject, watch } from 'vue'
import L from 'leaflet'
import type { MarkerItem } from './types'
import type { PropType, ShallowRef } from 'vue'
// Props
const props = defineProps({
  markers: {
    type: Array as PropType<MarkerItem[]>,
    required: true
  }
})

// inject map
const map = inject<ShallowRef<L.Map | undefined>>('leafletMap')
if (!map) throw new Error('MapMarker must be used inside MapContainer!')

// 当前图层
let layer: L.LayerGroup | undefined

// watch markers 数组变化
watch(
  [() => props.markers, () => map.value],
  ([markers, mapInstance]) => {
    if (!mapInstance) return

    // 清空旧图层
    if (layer) layer.clearLayers()
    else layer = L.layerGroup().addTo(mapInstance)

    // 添加新 marker
    markers.forEach((m) => {
      const marker = L.marker(m.latLng)
      if (m.popup) marker.bindPopup(m.popup)
      marker.addTo(layer!)
    })
  },
  { immediate: true, deep: true }
)
</script>