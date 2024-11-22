<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <CitySelect @onChange="handleChangeCity"/>
        <FuelTypeFilter @onChange="handleChangeFuelTypeFilter"/>
      </el-header>
      <el-main>
        <!--    <TheWelcome/>-->
        <TheMap :city="selectedCity"
                :fuelType="selectedFuelType"
                :fuelStations="sortedFuelStations"
                @onMoveEnd="handleMoveEnd"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, toRaw } from 'vue';

import { getFuelStations, getMiddlePrices } from '@/api/services/main.service.js';

import TheWelcome from '../components/TheWelcome.vue';
import CitySelect from '@/components/CitySelect.vue';
import FuelTypeFilter from '@/components/FuelTypeFilter.vue';
import TheMap from '@/components/TheMap.vue';


const selectedCity = ref(null);
const selectedFuelType = ref(null);
const fuelStationsList = ref([]);
const middlePrices = ref(null);

const sortedFuelStations = computed(() => {
  if (!middlePrices.value) return [];
  const middlePrice = parseFloat(middlePrices.value[selectedFuelType.value]);
  fuelStationsList.value.sort((a, b) => a[selectedFuelType.value] - b[selectedFuelType.value]);

  return fuelStationsList.value.map((item) => {
    const rawObj = toRaw(item);
    rawObj['priceLevel'] = 'normal';

    if (rawObj[selectedFuelType.value] < middlePrice * 0.97) {
      rawObj.priceLevel = 'good'; // Ціна на 3% або більше нижча за середню
    } else if (rawObj[selectedFuelType.value] > middlePrice * 1.02) {
      rawObj.priceLevel = 'bad'; // Ціна на 3% або більше вища за середню
    }

    return rawObj;
  });
});

const handleChangeCity = async (city) => {
  selectedCity.value = city;

  const fuelStationsData = await getFuelStations({cityId: city.id});
  fuelStationsList.value = fuelStationsData.data;
};

const handleChangeFuelTypeFilter = (val) => {
  selectedFuelType.value = val;
};

const handleMoveEnd = async (center) => {
  const gasStations = await getFuelStations({nearestTo: [ center.lng, center.lat ]});
  fuelStationsList.value = gasStations.data;
};

onMounted(async () => {
  const response = await getMiddlePrices();
  middlePrices.value = response.data;

});
</script>

<style>
.common-layout .el-header {
  --el-header-height: auto;
  margin-bottom: 10px;
}

.common-layout .el-main {
  --el-main-padding: 0;
}

.common-layout .el-main {
  height: calc(100vh - 70px - 10px);
  position: relative;
}
</style>