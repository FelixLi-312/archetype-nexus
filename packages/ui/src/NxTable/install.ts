import { VxeUI, VxeModal, install } from 'vxe-pc-ui'
import { VxeTable, VxeColumn, VxeColgroup, VxeGrid, VxeToolbar } from 'vxe-table'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
import 'vxe-pc-ui/es/style.css'
import 'vxe-table/es/style.css'
import { App } from 'vue'
VxeUI.use(VXETablePluginElement)

export const NxTable = {
  install(app: App) {
    if (app?.config?.globalProperties?.$t) {
      VxeUI.setConfig({
        i18n: app.config.globalProperties.$t
      })
    }

    app.use(VxeModal)
    app.use(VxeTable)
    app.use(VxeColumn)
    app.use(VxeColgroup)
    app.use(VxeGrid)
    app.use(VxeToolbar)
  }
}