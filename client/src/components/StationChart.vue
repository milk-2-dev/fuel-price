<template>
  <Line :data="chartData" :options="options" width="900" height="500"/>
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
  responsive: false,
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
      data.labels.push(props.data[i].updatedAt);
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

<style lang="scss" scoped>

</style>