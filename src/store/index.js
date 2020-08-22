import Vue from 'vue'
import Vuex from 'vuex'
import * as data from '@/data/db'
import * as dataUpdated from '@/data/dbUpdated'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    results: [],
    updaterShow: true // наличие кнопки в зависимости от роута
  },
  mutations: {
    SET_DATA (state, data) {
      state.results = data
    },
    SHOW_UPDATER: state => state.updaterShow = true,
    HIDE_UPDATER: state => state.updaterShow = false
  },
  actions: {
    GET_DATA ({commit}) {
      // fetch('https://jsonplaceholder.typicode.com/users')
      //   .then(async response => {
      //     commit('SET_DATA', await response.json())
      //   })

      // По хорошему здесь должен быть какой нибудь гет запрос на сервер
      // Например через axios, но его нет, поэтому я создал свою бд в виде большого массива
      commit('SET_DATA', data.dataBase)
    },
    UPDATE_DATA ({commit}) {
      // GET req to server

      commit('SET_DATA', dataUpdated.dataBase)
    }
  },
  getters: {
    getData: state => {
      return state.results
    }
  }
})
