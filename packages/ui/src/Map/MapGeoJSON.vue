<script setup lang="ts">
import { inject, watch, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import type { PropType } from 'vue'

const props = defineProps({
  /** GeoJSON 数据 */
  data: {
    type: Object as PropType<any>,
    required: true
  },
  /** Leaflet 样式 */
  options: {
    type: Object as PropType<L.GeoJSONOptions>,
    default: () => ({})
  },
  /** 是否自动缩放到该区域 */
  fitBounds: {
    type: Boolean,
    default: false
  }
})

const map = inject<any>('leafletMap')
let geojsonLayer: L.GeoJSON | undefined

const clearLayer = () => {
  if (geojsonLayer && map.value) {
    geojsonLayer.remove()
    geojsonLayer = undefined
  }
}

const renderGeoJSON = (data: any, mapInstance: L.Map) => {
  clearLayer()
  if (!data) return

  geojsonLayer = L.geoJSON(data, props.options).addTo(mapInstance)

  if (props.fitBounds) {
    const bounds = geojsonLayer.getBounds()
    if (bounds.isValid()) {
      mapInstance.fitBounds(bounds)
    }
  }
}

watch(
  [() => props.data, () => map.value],
  ([data, mapInstance]) => {
    if (!mapInstance || !data) return
    renderGeoJSON(data, mapInstance)
  },
  { immediate: true, deep: true }
)

onBeforeUnmount(() => {
  clearLayer()
})

defineExpose({
  getLayer: () => geojsonLayer
})
</script>

<template>
  <slot />
</template>
