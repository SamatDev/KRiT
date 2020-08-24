<template>
  <div class="home">
    <table-app 
      :resultsData="getData"
    />
  </div>
</template>

<script>
import TableApp from '@/components/TableApp'

export default {
  name: 'Home',
  components: {
    TableApp
  },
  created () {
    this.$store.dispatch('GET_DATA')
  },
  computed: {
    getData () {
      return this.$store.getters.getData
    }
  }
}
</script>

<style>
.page-link:focus{
  box-shadow: none !important
}
.chart {
  width: 100%;
  height: 300px;
}
.chart-container {
  text-align: center;
  margin-top: 75px;
  margin-bottom: 15px;
}
.chart-list .chart-container:first-child {
  margin-top: 35px;
}
</style>
