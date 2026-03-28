<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, provide, watch } from 'vue'
import L from 'leaflet'
import type { MapProps } from './types'

const props = withDefaults(defineProps<MapProps>(), {
  mapType: 'tdt',
  autoResize: true,
  resizeDebounce: 150
})

const emit = defineEmits(['ready', 'click', 'moveend', 'update:center', 'update:zoom', 'update:mapType'])



const mapRef = ref<HTMLDivElement>()
const map = shallowRef<L.Map>()
let resizeTimer: any = null
const tileLayers: L.TileLayer[] = []

const resetView = () => {
  if (map.value) {
    map.value.flyTo(props.center, props.zoom)
  }
}

provide('leafletMap', map)
provide('resetView', resetView)


// 🌍 地图服务
const MAP_SERVICES = {
  // 矢量底图
  tdt: (key: string) => [
    `https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${key}`,
    `https://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${key}`
  ],
  // 影像底图
  tdt_img: (key: string) => [
    `https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${key}`,
    `https://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${key}`
  ],
  // 地形晕渲
  tdt_terrain: (key: string) => [
    `https://t0.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${key}`,
    `https://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${key}`
  ]
}


const getTileUrls = () => {
  if (props.tileLayerUrl) return [props.tileLayerUrl]
  const service = (MAP_SERVICES as any)[props.mapType]
  return typeof service === 'function' ? service(props.apiKey!) : service
}

const updateTileLayers = () => {
  if (!map.value) return
  
  // 移除旧图层
  tileLayers.forEach(layer => layer.remove())
  tileLayers.length = 0

  // 添加新图层
  getTileUrls().forEach((url : string) => {
    const layer = L.tileLayer(url, props.tileLayerOptions).addTo(map.value!)
    tileLayers.push(layer)
  })
}

const initMap = () => {
  map.value = L.map(mapRef.value!, {
    center: props.center,
    zoom: props.zoom,
    ...props.options
  })

  updateTileLayers()

  bindEvents()
  emit('ready', map.value)
}

const bindEvents = () => {
  map.value?.on('click', e => emit('click', e.latlng))

  map.value?.on('moveend', () => {
    const center = map.value!.getCenter()
    const zoom = map.value!.getZoom()

    emit('moveend', { center: [center.lat, center.lng], zoom })
    emit('update:center', [center.lat, center.lng])
    emit('update:zoom', zoom)
  })
}

const flyTo = (center: [number, number], zoom?: number) => {
  map.value?.flyTo(center, zoom ?? map.value.getZoom())
}


const setZoom = (zoom: number) => map.value?.setZoom(zoom)
const getMap = () => map.value

const handleResize = () => {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => map.value?.invalidateSize(), props.resizeDebounce)
}

watch(() => props.center, val => map.value?.flyTo(val))
watch(() => props.zoom, val => map.value?.setZoom(val))
watch(() => props.mapType, () => updateTileLayers())

onMounted(() => {
  initMap()
  if (props.autoResize) window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  map.value?.remove()
})

defineExpose({ flyTo, setZoom, getMap, resetView })
</script>

<template>
  <div class="map-container">
    <div ref="mapRef" style="height:100%;width:100%"></div>
  <slot />
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
