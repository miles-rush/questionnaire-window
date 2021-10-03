import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
// import axios from 'axios'
import {Loading} from '@element-plus/icons'




const app = createApp(App)
// dev接口
app.config.globalProperties.$url = 'http://81.69.223.15:7946/'
// prod 接口
// app.config.globalProperties.$url = 'http://81.69.223.15:7948/'

app.component('Loading', Loading)

app.use(router)
app.use(ElementPlus)
// app.use(axios)

app.mount('#app')
