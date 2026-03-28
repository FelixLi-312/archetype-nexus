import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.scss'
const app = createApp(App)
import { install as installUI } from '@nexus/ui'
import router from './router'

app.use(router)
installUI(app)
app.mount('#app')
