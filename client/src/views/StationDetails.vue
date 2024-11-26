<template>
  <div class="station-details">
    <el-drawer v-model="drawer"
               direction="btt"
               @close="handleCloseDrawer"
    >
      <template #header>
        <h3>{{ stationData?.name }}</h3>
      </template>
      <template #default>
        <el-date-picker
          style="margin: 0 0 8px"
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
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getFuelStation } from '@/api/services/main.service.js';
import StationChart from '@/components/StationChart.vue';


const props = defineProps([ 'stationId' ]);
const emits = defineEmits([ 'onClose' ]);

const drawer = ref(false);

const stationData = ref(null);

const dateRange = ref([ new Date(new Date().setHours(0, 0)), new Date(Date.now()) ]);

const disabledDates = (date) => {
  const today = new Date();
  return date.getTime() > today;
};

const handleCloseDrawer = () => {
  emits('onClose');
};

const handleChangeDateRange = (val) => {
  getStation(val);
};

const getStation = async (dateRange) => {
  const queries = {
    startDay: dateRange[0].toISOString(),
    endDay: dateRange[1].toISOString(),
  };

  const result = await getFuelStation(props.stationId, queries);
  stationData.value = result.data;
};

watch(() => props.stationId, async (newVal) => {
  if (newVal) {
    await getStation(dateRange.value);
    drawer.value = true;
  }
});
</script>

<style>
.station-details .el-overlay {
  --el-overlay-color-lighter: transperent;
  top: calc(30% + 55px);
}

.station-details .el-drawer {
  height: 100% !important;
}

.station-details .el-drawer__header {
  margin-bottom: 0;
}
</style>