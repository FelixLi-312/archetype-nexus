<script setup lang="ts">
import { inject, watch } from 'vue'
import L from 'leaflet'
import 'leaflet.heat'

const props = defineProps<{ points: [number, number, number][] }>()
const map = inject<any>('leafletMap')
let heat: any

watch([() => props.points, () => map.value], ([val, mapInstance]) => {
  if (!mapInstance) return

  if (heat) heat.remove()
  heat = L.heatLayer(val, { radius: 25 }).addTo(mapInstance)
}, { immediate: true })
</script>
