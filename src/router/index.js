import Vue from 'vue'
import Router from 'vue-router'
import Chat from '../components/Chat';
import Login from '../components/Login';
import Register from '../components/Register';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Chat,
      meta: {
        title: 'Free chatrooms',
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      component: Login,
      meta: {
        title: 'Login into account',
        requiresAuth: false,
        preventAuth: true,
      },
    },
    {
      path: '/register',
      component: Register,
      meta: {
        title: 'Register new account',
        requiresAuth: false,
        preventAuth: true,
      },
    },
  ]
});