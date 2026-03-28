// src/types/map.ts
import type { MapOptions, TileLayerOptions } from 'leaflet'
// tdt: 矢量底图 tdt_img：影像底图  tdt_terrain：  地形晕渲
export type MapType = 'tdt' | 'tdt_img' | 'tdt_terrain'
export interface MarkerItem {
  latLng: [number, number]
  popup?: string
}


export interface MapProps {
  /** 地图中心点 [lat, lng] */
  center: [number, number]
  /** 缩放级别 */
  zoom: number
  /** 容器 ID */
  id?: string
  /** 地图配置项 (排除 layers，因为我们会手动处理) */
  options?: Omit<MapOptions, 'layers'>
  /** 瓦片层 URL */
  tileLayerUrl?: string
  /** 瓦片层配置项 */
  tileLayerOptions?: TileLayerOptions
  /** 是否自动监听窗口大小变化 */
  autoResize?: boolean
  /** 防抖延迟时间 (ms)，用于 resize 事件 */
  resizeDebounce?: number
  // 地图类型  默认 osm tdt： 天地图  gaode： 高德地图
  mapType?: MapType // 'osm' | 'tdt' | 'gaode' 
  /** 地图 API 密钥 (如需要) */
  apiKey: string
}

export interface MapEmits {
  (e: 'ready', map: L.Map): void
  (e: 'click', latLng: L.LatLng): void
  (e: 'moveend', data: { center: [number, number]; zoom: number }): void
  (e: 'update:center', value: [number, number]): void
  (e: 'update:zoom', value: number): void
  (e: 'update:mapType', value: MapType): void
}

export interface MapExpose {
  getMap: () => L.Map | null
  flyTo: (center: [number, number], zoom?: number) => void
  setZoom: (zoom: number) => void
  invalidateSize: () => void
}
