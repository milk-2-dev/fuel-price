<template>
  <div class="price-chart">
    <Line
      :data="chartData"
      :options="options"/>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';
import { computed } from 'vue';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps([ 'data' ]);

const options = {
  responsive: true,
  maintainAspectRatio: false
};

const chartData = computed(() => {
  const data = {
    labels: []
  };
  const typeE10 = [];
  const typeSuper = [];
  const typeDiesel = [];

  if (props.data) {
    for (let i = 0; i < props.data.length; i++) {
      data.labels.push(new Date(props.data[i].updatedAt).toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
      }));
      typeE10.push(props.data[i].e10);
      typeSuper.push(props.data[i].super);
      typeDiesel.push(props.data[i].diesel);
    }
  }

  data.datasets = [
    {
      label: 'E10',
      backgroundColor: 'red',
      data: typeE10.reverse()
    },
    {
      label: 'SUPER',
      backgroundColor: 'blue',
      data: typeSuper.reverse()
    },
    {
      label: 'DIESEL',
      backgroundColor: 'brown',
      data: typeDiesel.reverse()
    }
  ];

  data.labels.reverse();

  return data;
});

</script>

<style>
.price-chart {
  position: relative;
  height: 400px;
}
</style>