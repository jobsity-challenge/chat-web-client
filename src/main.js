import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

/* Setup vue router */
import router from './router';

/**
 * Hook triggered before to load a route
 * If the route require auth the user must be authenticated, in other
 * case is redirected to the login page
 */
router.beforeEach((to, from, next) => {
  /* Check for requiresAuth metadata */
  if (to.matched.some(record => record.meta.requiresAuth)) {
    /* Check if user is not logged */
    if (!store.getters.isLogged) {
      next({ path: '/login', query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } else {
    next();
  }
});

/**
 * Hook triggered before to load a route
 * If the route must prevent auth the user must not be authenticated, in other
 * case is redirected to the main page
 */
router.beforeEach((to, from, next) => {
  /* Check for requiresAuth metadata */
  if (to.matched.some(record => record.meta.preventAuth)) {
    /* Check if user is logged */
    if (store.getters.isLogged) {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    next();
  }
});

/* Setup vuex store */
import { store } from './store';

/* Setup axios */
import axios from 'axios';

/**
 * AXIOS interceptor to inject authentication into requests
 */
axios.interceptors.request.use((request) => {
  /* Check if the request must bypass the Authorization header */
  if (request.headers["noauth"]) {
    delete request.headers.Authorization;
    return request;
  }

  /* Check if the authorization header is set */
  if (request.headers.Authorization) {
    if (request.headers.Authorization === 'USER') {
      /* Request must authenticate with user token */
      request.headers.Authorization = `Bearer ${store.getters.userToken}`;
    } else if (request.headers.Authorization === 'SERVICE') {
      /* Request must authenticate with service token */
      request.headers.Authorization = `Bearer ${store.getters.serviceToken}`;
    }
  } else {
    /* Check if the user is authenticated to send Bearer token */
    if (store.getters.userToken) {
      /* Authenticate with user token */
      request.headers.Authorization = `Bearer ${store.getters.userToken}`;
    } else if (store.getters.serviceToken) {
      /* Authenticate with service token */
      request.headers.Authorization = `Bearer ${store.getters.serviceToken}`;
    }
  }

  return request;
})

/* Setup vue-snotify */
import Snotify, {SnotifyPosition} from 'vue-snotify';
import "vue-snotify/styles/material.css";

const options = {
	toast: {
		position: SnotifyPosition.rightTop
	}
}
Vue.use(Snotify, options);


Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App),
  created: async () => {
    /* Authenticate the service account */
    await store.dispatch("callAuthenticateService");

    /* Try to authenticate the user account if the tokens is stored */
    await store.dispatch("callUserValidation");
  },
  destroyed: async () => {
    await store.dispatch("callLogoutService");
  }
}).$mount('#app')
