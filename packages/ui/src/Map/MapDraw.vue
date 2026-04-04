/**
 * 地图绘制组件
 * 用于在地图上添加绘制功能，如绘制矩形、多边形、圆等
 * 支持自定义绘制项配置和事件绑定
 */
<template></template>
<script setup lang="ts">
import { inject, watch } from 'vue'
import L from 'leaflet'
import 'leaflet-draw'

const map = inject<any>('leafletMap')

watch(() => map.value, (mapInstance) => {
  if (!mapInstance) return

  const drawnItems = new L.FeatureGroup()
  mapInstance.addLayer(drawnItems)

  const drawControl = new L.Control.Draw({ edit: { featureGroup: drawnItems } })
  mapInstance.addControl(drawControl)

  mapInstance.on(L.Draw.Event.CREATED, (e: any) => drawnItems.addLayer(e.layer))
}, { immediate: true })
</script>