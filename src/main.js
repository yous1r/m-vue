import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import 'amfe-flexible'
import '@/utils/UI'
import Theme from '@/assets/theme.js'
import '@/styles/base.less'

Vue.config.productionTip = false
Vue.prototype.themeColor = Theme

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
