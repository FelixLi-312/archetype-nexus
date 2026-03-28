<script setup lang="ts">
import { inject, watch } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'
import type { MarkerItem } from './types'
import type { PropType } from 'vue'
const props = defineProps({
  markers: {
    type: Array as PropType<MarkerItem[]>,
    required: true
  }
})
const map = inject<any>('leafletMap')
let cluster: any

watch([() => props.markers, () => map.value], ([val, mapInstance]) => {
  if (!mapInstance) return

  if (cluster) cluster.clearLayers()
  cluster = L.markerClusterGroup()

  val.forEach(m => {
    cluster.addLayer(L.marker(m.latLng))
  })

  mapInstance.addLayer(cluster)
}, { immediate: true })
</script>