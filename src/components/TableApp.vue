<template>
  <div class="content">
    <!-- Bs tabs -->
    <b-tabs content-class="mt-2 col-sm-12" class="col-sm-12" align="center">
      <b-tab title="Линейная диаграмма данных за 7 последних дней" lazy>
        <b-alert show>
          <anychart-app :options="lineChartData" />
        </b-alert>
      </b-tab>

      <b-tab title="Круговая диаграмма" lazy>
        <b-alert show>
          <anychart-app :options="pieChartData" />
        </b-alert>
      </b-tab>

      <b-tab title="Столбиковая диаграмма" lazy>
        <b-alert show>
          <anychart-app :options="columnChartData" />
        </b-alert>
      </b-tab>
    </b-tabs>

    <!-- Bs table-->
    <div class="col-sm-12">
      <b-table small striped hover :items="paginated" :fields="fields">
        <template v-slot:cell(id)="data">
          <b class="primary">{{ data.item.index + 1 }}</b>
        </template>
        <template v-slot:cell(dynamic)="data">
          <b
            :class="[{ 'text-danger' : Number(data.item.dynamic) < 0 }, { 'text-success' : Number(data.item.dynamic) > 0 }]"
          >{{ data.item.dynamic }}%</b>
        </template>
        <template v-slot:cell(percentExports)="data">
          <b class="text-info">{{ data.item.percentExports }}%</b>
        </template>
        <template v-slot:cell(oneOverdue)="data">
          <b>{{ data.item.overdue.one }}</b>
        </template>

        <!-- 
        Ниже 3 темплейта, которые связаны с fields через cell('field key')
        Внутри тега <b> происходит расчет средней арифметической, т.к. значения в базе рандомные =>
            они не все ЧЕТНЫЕ, а значит их нужно округлить до целых (нечетное число не делится на 2 без остатка :) )
        -->

        <template v-slot:cell(twoThreeeOverdue)="data">
          <b>{{ Math.round((data.item.overdue.two + data.item.overdue.three) / 2) }}</b>
        </template>
        <template v-slot:cell(fourFiveOverdue)="data">
          <b>{{ Math.round((data.item.overdue.four + data.item.overdue.five) / 2) }}</b>
        </template>
        <template v-slot:cell(sixPlus)="data">
          <b>{{ Math.round((data.item.overdue.six + data.item.overdue.seven) / 2) }}</b>
        </template>
      </b-table>
    </div>

    <!-- pagination from bs-->
    <div class="overflow-auto align-self-end mr-3">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        first-text="Начало"
        prev-text="Предыдущий"
        next-text="Следующий"
        last-text="Последний"
      />
    </div>
  </div>
</template>

<script>
import AnychartApp from "@/components/AnychartApp";

export default {
  name: "table-app",
  components: {
    AnychartApp,
  },
  props: {
    resultsData: {
      type: Array,
    },
  },
  data() {
    return {
      fields: [
        {
          key: "id",
          label: "№",
          sortable: true,
        },
        {
          key: "company",
          label: "Наименования",
          sortable: true,
        },
        {
          key: "numberExports",
          label: "Наличие графика вызова",
          sortable: true,
        },
        {
          key: "percentExports",
          label: "Вызов КП",
          sortable: true,
        },
        {
          key: "dynamic",
          label: "Динамика",
          sortable: true,
        },
        {
          key: "oneOverdue",
          label: "1 день",
          sortable: true,
        },
        {
          key: "twoThreeeOverdue",
          label: "2-3 дня",
          sortable: true,
        },
        {
          key: "fourFiveOverdue",
          label: "4-5 дней",
          sortable: true,
        },
        {
          key: "sixPlus",
          label: "6 и более дней",
          sortable: true,
        },
      ],
      rows: this.resultsData.length,
      perPage: 5,
      currentPage: 1,
    };
  },
  computed: {
    // Данные на каждой страницы пагинации
    paginated() {
      let from = (this.currentPage - 1) * this.perPage,
        to = from + this.perPage;

      return this.resultsData.slice(from, to);
    },
    // Данные для столбиковая диаграммы
    columnChartData() {
      // Предварительный объект для Anychart'a
      let formData = {
        chart: {
          type: "column",
          series: [
            {
              data: [],
            }
          ],
          title: 'Ордината - наличие графика вызова (зависит от 5 актуальных данных на странице)'
        },
      };
      this.paginated.forEach((element) => {
        // создаем массив, который берет данные у нужного нам элемента массива paginated
        let arr = [element.company, element.numberExports];
        // пушим его в formData
        formData.chart.series[0].data.push(arr);
      });
      // Возвращаем полученный объект данных и отправляем в options Anychart component
      return formData;
    },

    // ДАННЫЕ ДЛЯ ДИАГРАММ

    // Данные для круговой диаграммы
    // Так же аналогично
    pieChartData() {
      let formData = {
        chart: {
          type: "pie",
          data: [],
        },
      };

      this.paginated.forEach((element) => {
        let arr = [element.company, element.numberExports];
        formData.chart.data.push(arr);
      });

      return formData;
    },

    // Для линейной диаграммы
    lineChartData() {
      // Предварительный объект
      let formData = {
        chart: {
          type: "line",
          series: [],
        },
      };
      // Нам не обходимо получить актуальную дату и дату за последние 7 дней,
      // данная функция должна справитmся с этой задачей и вернуть готовую дату
      function addDays(days) {
        let date = new Date();
        date.setDate(date.getDate() - days);
        return date.toLocaleDateString();
      }
      // Я решил, что в моей диаграмме и ось абсцисс так же будет динамической
      // Я больше сторонник for, но в данном случае я вижу форич более красивым и очевидным
      this.paginated.forEach((element) => {
        let obj = {
          data: [
            { x: addDays(7), value: element.overdue.seven },
            { x: addDays(6), value: element.overdue.six },
            { x: addDays(5), value: element.overdue.five },
            { x: addDays(4), value: element.overdue.four },
            { x: addDays(3), value: element.overdue.three },
            { x: addDays(2), value: element.overdue.two },
            { x: addDays(1), value: element.overdue.one },
          ],
        };
        formData.chart.series.push(obj);
      });
      return formData;
    },
  },
  watch: {
    resultsData: function () {
      this.rows = this.resultsData.length;
    },
  },
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 1800px;
  margin: 0 auto;
  min-height: 100vh;
  height: auto;
}

@media (max-width: 1278px) {
  .content {
    margin-top: 3rem;
    min-height: unset;
  }
}
@media (min-width: 1279px) {
  .content {
    max-width: 1152px;
  }
}
@media (min-width: 1919px) {
  .content {
    max-width: 1800px;
  }
}
</style>