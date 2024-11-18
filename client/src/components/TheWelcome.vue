<script setup>
import { computed, onBeforeUnmount, onMounted, ref, toRaw } from 'vue';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { getCities, getFuelStations, getMiddlePrices } from '@/api/services/main.service.js';

const mapRef = ref(null);
const mapContainerRef = ref(null);

const city = ref(null);
const middlePrices = ref(null);
const citiesList = ref(null);
const fuelStationsList = ref([]);

const userLocation = ref(null);
const zoom = ref(10);
const defaultMapCenter = [ 13.41053, 52.52437 ]; //Berlin
const isMapHovered = ref(false);
const markers = ref([]);
const isNeedToUpdate = ref(true);

const fuelType = ref('e10');


const mapCenter = computed(() => {
  if (city.value) {
    return [ city.value.location.longitude, city.value.location.latitude ];
  }

  return defaultMapCenter;
});

const handleChangeCity = async (city) => {
  const gasStations = await getFuelStations({cityId: city.id});
  fuelStationsList.value = gasStations.data;

  // mapRef.value.flyTo({center: [ city.location.longitude, city.location.latitude ]});
  //
  // for (let i = 0; i < markers.value.length; i++) {
  //   markers.value[i].remove();
  // }
  //
  // markers.value = fuelStationsList.value.map((item) => {
  //   return new mapboxgl.Marker({
  //     // element: stationMarker(item),
  //     color: '#000'
  //   })
  //     .setLngLat(item.location.coordinates);
  // });
  //
  // for (let i = 0; i < markers.value.length; i++) {
  //   markers.value[i].addTo(mapRef.value);
  // }
};
const getNearestFuelStations = async (coordinates) => {
  const gasStations = await getFuelStations({nearestTo: coordinates});
  fuelStationsList.value = gasStations.data;

  for (let i = 0; i < markers.value.length; i++) {
    markers.value[i].remove();
  }

  markers.value = fuelStationsList.value.map((item) => {
    return new mapboxgl.Marker({
      // element: stationMarker(item),
      color: '#000'
    })
      .setLngLat(item.location.coordinates);
  });

  for (let i = 0; i < markers.value.length; i++) {
    markers.value[i].addTo(mapRef.value);
  }
};

const stationMarker = (data) => {
  const markerElement = document.createElement('div');
  markerElement.className = 'custom-marker';
  markerElement.style.width = '30px';
  markerElement.style.height = '30px';
  markerElement.style.backgroundSize = 'cover';

  markerElement.innerHTML = `<p>${data.name}</p>`;

  return markerElement;
};

const sortedFuelStations = computed(() => {
  if (!middlePrices.value) return [];
  const middlePrice = parseFloat(middlePrices.value[fuelType.value]);
  fuelStationsList.value.sort((a, b) => a[fuelType.value] - b[fuelType.value]);

  const withPriceLevel = fuelStationsList.value.map((item) => {
    const rawObj = toRaw(item);
    rawObj['priceLevel'] = 'normal';

    if (rawObj[fuelType.value] < middlePrice * 0.97) {
      rawObj.priceLevel = 'good'; // Ціна на 3% або більше нижча за середню
    } else if (rawObj[fuelType.value] > middlePrice * 1.02) {
      rawObj.priceLevel = 'bad'; // Ціна на 3% або більше вища за середню
    }

    return rawObj;
  });

  return withPriceLevel;
});

onMounted(async () => {
  const response = await getMiddlePrices();
  middlePrices.value = response.data;

  // mapboxgl.accessToken = 'pk.eyJ1IjoibWlsay0yLWRldiIsImEiOiJjbTNmdzdjeGkwMDh6MnFzOGsxaDRibGxyIn0.qfDvVCwBAFD1lMbOT4O9Xw';
  //
  // mapRef.value = new mapboxgl.Map({
  //   container: mapContainerRef.value,
  //   center: mapCenter.value,
  //   zoom: zoom.value
  // });

  /////////////////

  // userLocation.value = new mapboxgl.GeolocateControl({
  //   fitBoundsOptions: {
  //     maxZoom: 9
  //   },
  //   positionOptions: {
  //     enableHighAccuracy: true
  //   },
  //   trackUserLocation: false,
  //   showUserHeading: false
  // });
  //
  // mapRef.value.addControl(
  //   userLocation.value
  // );

  // mapRef.value.on('load', () => {
  //   userLocation.value.trigger();
  //   geolocationButtonTriggered.value = true;
  //   userLocation.value._geolocateButton.parentNode.style.visibility = 'hidden';
  //
  //   userLocation.value._geolocateButton.addEventListener('click', () => {
  //     geolocationButtonTriggered.value = true;
  //     isNeedToUpdate.value = true;
  //     userLocation.value._geolocateButton.parentNode.style.visibility = 'hidden';
  //   });
  // });

  // const prevCenter = ref(null);
  // const geolocationButtonTriggered = ref(false);
  //
  // mapRef.value.on('movestart', async () => {
  //   if (!geolocationButtonTriggered.value) {
  //     userLocation.value._geolocateButton.parentNode.style.visibility = 'visible';
  //   }
  // });

  // mapRef.value.on('moveend', async () => {
  //   const center = mapRef.value.getCenter(); // Отримуємо центр карти
  //
  //   if (!prevCenter.value || (prevCenter.value[0] !== center.lng || prevCenter.value[1] !== center.lat)) {
  //     prevCenter.value = [ center.lng, center.lat ];
  //
  //     if (isNeedToUpdate.value) {
  //       await getNearestFuelStations([ center.lng, center.lat ]);
  //       city.value = null;
  //       isNeedToUpdate.value = false;
  //       geolocationButtonTriggered.value = false;
  //     }
  //   }
  // });

  const cities = await getCities();
  citiesList.value = cities.data;
});

onBeforeUnmount(() => {
  mapRef.value.remove();
});
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="12" :offset="6">
      <el-space direction="vertical" :fill="true" style="width: 100%">
        <el-radio-group v-model="fuelType" size="small">
          <el-radio-button label="E10" value="e10"/>
          <el-radio-button label="Super" value="super"/>
          <el-radio-button label="Diesel" value="diesel"/>
        </el-radio-group>

        <!--        <div ref="mapContainerRef" class="stations-map" style="height:450px;"/>-->

        <div class="stations-list">
          <div class="select-wrapper">
            <el-select
              class="stations-city-select"
              v-model="city"
              value-key="id"
              placeholder="Select"
              size="large"
              @change="handleChangeCity"
            >
              <el-option
                v-for="item in citiesList"
                :key="item.id"
                :label="item.name + ', ' + item.postCode"
                :value="item"
              />
            </el-select>
          </div>


          <template v-for="station in sortedFuelStations"
                    :key="station.stationId">

            <RouterLink :to="/station/+station._id">
              <h3>{{ station.name }}</h3>
            </RouterLink>

            <el-row>
              <el-col :span="7">
                <el-statistic title="e10" :value="station.e10" :precision="3">
                  <template v-if="station.trend"
                            #suffix
                  >
                    <el-icon class="red" v-if="station.trend.e10 === 'up'">
                      <CaretTop/>
                    </el-icon>
                    <el-icon class="green" v-if="station.trend.e10 === 'down'">
                      <CaretBottom/>
                    </el-icon>
                  </template>
                </el-statistic>
                <span v-if="fuelType === 'e10'">{{station.priceLevel}}</span>
              </el-col>
              <el-col :span="7">
                <el-statistic title="Super" :value="station.super" :precision="3">
                  <template v-if="station.trend"
                            #suffix
                  >
                    <el-icon class="red" v-if="station.trend.super === 'up'">
                      <CaretTop/>
                    </el-icon>
                    <el-icon class="green" v-if="station.trend.super === 'down'">
                      <CaretBottom/>
                    </el-icon>
                  </template>
                </el-statistic>
                <span v-if="fuelType === 'super'">{{station.priceLevel}}</span>
              </el-col>
              <el-col :span="7">
                <el-statistic title="Diesel" :value="station.diesel" :precision="3">
                  <template v-if="station.trend"
                            #suffix
                  >
                    <el-icon class="red" v-if="station.trend.diesel === 'up'">
                      <CaretTop/>
                    </el-icon>
                    <el-icon class="green" v-if="station.trend.diesel === 'down'">
                      <CaretBottom/>
                    </el-icon>
                  </template>
                </el-statistic>
                <span v-if="fuelType === 'diesel'">{{station.priceLevel}}</span>
              </el-col>
            </el-row>

            <el-divider/>
          </template>
        </div>
      </el-space>

    </el-col>
  </el-row>
</template>

<style>
.green {
  color: var(--el-color-success) !important;
}

.red {
  color: var(--el-color-error) !important;
}

.stations-map {
  position: relative;
}

.stations-list {
  position: relative;
  background: #fff;
}

.select-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stations-city-select.el-select {
  width: 250px;
  position: relative;
  top: 0;
  transition: .3s ease-in-out;
  z-index: 10000;
}

.stations-list.list-to-top .stations-city-select {
  top: -100px
}
</style>
