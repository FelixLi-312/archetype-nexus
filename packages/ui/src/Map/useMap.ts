import { inject } from 'vue'
import type { ShallowRef } from 'vue'
import type L from 'leaflet'

export const useMap = () => {
  const map = inject<ShallowRef<L.Map | undefined>>('leafletMap')

  if (!map) {
    throw new Error('useMap must be used inside <MapContainer>')
  }

  return map
}