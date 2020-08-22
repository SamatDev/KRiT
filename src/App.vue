<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Таблицы и диаграммы</router-link>|
      <router-link to="/about">Об этом приложении</router-link>
    </div>
    <div class="updater">
      <b-icon v-if="isUpdated" animation="pulse" icon="check" variant="success" scale="3" />
      <b-spinner v-if="isLoading" class="ml-2" variant="success" label="Spinning"></b-spinner>
      <b-button
        class="update-btn"
        v-if="show"
        variant="success"
        @click="updateDB"
        :disabled="btnStatus"
      >Обновить данные</b-button>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isLoading: false,
      isUpdated: false,
      btnStatus: false,
    };
  },
  methods: {
    updateDB() {
      this.isLoading = true;
      // имитация загрузки
      setTimeout(
        function () {
          this.$store.dispatch("UPDATE_DATA");
          this.isLoading = false;
          this.isUpdated = true;
          this.btnStatus = true;
          setTimeout(
            function () {
              this.isUpdated = false;
              this.btnStatus = false;
            }.bind(this),
            60 * 1000
          );
        }.bind(this),
        3000
      );
      // без байнда this не будет в области видимости
    },
  },
  computed: {
    show() {
      return this.$store.state.updaterShow;
    },
  },
  watch: { //наблюдаем за роутом, что бы скрыть/показать кнопку обновления данных
    $route: function () {
      if (this.$route.path === '/about') {
        this.$store.commit("HIDE_UPDATER");
      } else {
        this.$store.commit("SHOW_UPDATER");
      }
    },
  },
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.updater {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  top: 0.5rem;
  right: 0.5rem;
}
.update-btn {
  margin-left: 1rem;
}
#nav {
  position: fixed;
  top: 0;
  left: 0;
  padding: 7px 15px;
  z-index: 5;
  background: #fff;
  border-bottom-right-radius: 22px;
  border: 1px solid gray;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #007bff;
}
</style>
