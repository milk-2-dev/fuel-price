<template>
  <div class="station-details">
    <el-page-header @back="goBack">
      <template #content>
        {{stationData?.name}}
      </template>


      <el-date-picker
        style="margin: 20px 0"
        v-model="dateRange"
        type="daterange"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
        :clearable="false"
        :defaultTime="[dateRange[0], dateRange[1]]"
        :disabled-date="disabledDates"
        @change="handleChangeDateRange"
      />

      <StationChart :data="stationData?.prices"/>

      <el-table :data="stationData?.prices" stripe style="width: 100%">
        <el-table-column prop="updatedAt"
                         label="Date"
                         width="180">
          <template #default="scope">{{ new Date(scope.row.updatedAt).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="e10" label="E10" width="180" />
        <el-table-column prop="super" label="Super" />
        <el-table-column prop="diesel" label="Diesel" />
      </el-table>
    </el-page-header>
  </div>
</template>

<style>
.station-details{
  padding: 1rem;
}
</style>
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getFuelStation } from '@/api/services/main.service.js';
import StationChart from '@/components/StationChart.vue';

const route = useRoute();
const router = useRouter();
const stationData = ref(null);

const dateRange = ref([new Date(new Date().setHours(0,0)), new Date(Date.now())])

const disabledDates = (date) => {
  const today = new Date();
  return date.getTime() > today;
};

const handleChangeDateRange = (val) => {
  getStation(val);
}

const getStation = async (dateRange) => {
  const queries = {
    startDay: dateRange[0].toISOString(),
    endDay: dateRange[1].toISOString(),
  };

  const result = await getFuelStation(route.params.id, queries);
  stationData.value = result.data;
};

onMounted(async () => {
  await getStation(dateRange.value);
});

const goBack = () => {
  router.back()
};
</script>