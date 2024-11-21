<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <CitySelect @onChange="handleChangeCity"/>
        <FuelTypeFilter @onChange="handleChangeFuelTypeFilter"/>
      </el-header>
      <el-main>
        <!--    <TheWelcome/>-->
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import { getFuelStations } from '@/api/services/main.service.js';

import TheWelcome from '../components/TheWelcome.vue';
import CitySelect from '@/components/CitySelect.vue';
import FuelTypeFilter from '@/components/FuelTypeFilter.vue';


const fuelStationsList = ref([]);

const handleChangeCity = async (city) => {
  const fuelStationsData = await getFuelStations({cityId: city.id});
  fuelStationsList.value = fuelStationsData.data;
};

const handleChangeFuelTypeFilter = (val) => {
  console.log(val);
  // updateMarkers();
}
</script>

<style>
.common-layout .el-header{
  --el-header-height: auto;
}
</style>