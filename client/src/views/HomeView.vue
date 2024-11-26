<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <CitySelect @onChange="handleChangeCity"/>
        <FuelTypeFilter @onChange="handleChangeFuelTypeFilter"/>
      </el-header>
      <el-main>
        <TheMap ref="map"
                :city="selectedCity"
                :fuelType="selectedFuelType"
                :fuelStations="sortedFuelStations"
                :class="selectedStation ? 'station--selected' : null"
                @onMoveEnd="handleMoveEnd"
                @onClickMarker="handleClickMarker"
        />

        <StationDetails :stationId="selectedStation"
                        @onClose="handleCloseDrawer"/>

      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, toRaw } from 'vue';

import { getFuelStations, getMiddlePrices } from '@/api/services/main.service.js';

import CitySelect from '@/components/CitySelect.vue';
import FuelTypeFilter from '@/components/FuelTypeFilter.vue';
import TheMap from '@/components/TheMap.vue';
import StationDetails from '@/views/StationDetails.vue';


const selectedCity = ref(null);
const selectedFuelType = ref(null);
const selectedStation = ref(null);
const fuelStationsList = ref([]);
const middlePrices = ref(null);

const map = ref(null);

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

const handleClickMarker = (stationData) => {
  const {id, location} = stationData;
  selectedStation.value = id;

  setTimeout(() => {
    map.value
      .resizeMap()
      .flyTo({
        center: location.coordinates,
        zoom: 12
      });
  }, 100);
};

const handleCloseDrawer = () => {
  selectedStation.value = null;

  setTimeout(() => {
    map.value.resizeMap();
  }, 100);
};

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

.station--selected {
  top: 0;
  bottom: auto;
  height: 30%;
}
</style>