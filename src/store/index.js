import Vue from 'vue'
import Vuex from 'vuex'

/* Vuex modules */
import accounts from './modules/accounts';
import chat from './modules/chat';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    accounts,
    chat,
  }
})