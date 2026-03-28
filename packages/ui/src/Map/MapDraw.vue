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