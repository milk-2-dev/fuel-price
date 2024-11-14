<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { getCities, getFuelStations } from '@/api/services/main.service.js';

const mapRef = ref(null);
const mapContainerRef = ref(null);

const city = ref(null);
const citiesList = ref(null);
const fuelStationsList = ref(null);

const zoom = ref(10);
const defaultMapCenter = [ 13.41053, 52.52437 ]; //Berlin
const isMapHovered = ref(false);
const markers = ref([]);

const mapCenter = computed(() => {
  if (city.value) {
    return [ city.value.location.longitude, city.value.location.latitude ];
  }

  return defaultMapCenter;
});

const handleChangeCity = async (city) => {
  const gasStations = await getFuelStations(city.id);
  fuelStationsList.value = gasStations.data;

  mapRef.value.flyTo({center: [ city.location.longitude, city.location.latitude ]});

  for (let i = 0; i < markers.value.length; i++) {
    markers.value[i].remove();
  }

  markers.value = fuelStationsList.value.map((item) => {
    return new mapboxgl.Marker({
      // element: stationMarker(item),
      color: '#000'
    })
      .setLngLat([ item.location.longitude, item.location.latitude ]);
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

onMounted(async () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoibWlsay0yLWRldiIsImEiOiJjbTNmdzdjeGkwMDh6MnFzOGsxaDRibGxyIn0.qfDvVCwBAFD1lMbOT4O9Xw';

  mapRef.value = new mapboxgl.Map({
    container: mapContainerRef.value,
    center: mapCenter.value,
    zoom: zoom.value
  });

  // Initialize the geolocate control.
  const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  });
// Add the control to the map.
  mapRef.value.addControl(geolocate);

  // mapRef.value.on('load', () => {
  //   geolocate.trigger();
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
        <div ref="mapContainerRef" class="stations-map" style="height:450px;"/>

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


          <template v-for="station in fuelStationsList"
                    :key="station.stationId">

            <RouterLink :to="/station/+station._id">
              <h3>{{ station.name }}</h3>
            </RouterLink>

            <el-row>
              <el-col :span="7">
                <el-statistic title="e10" :value="station.e10" :precision="3">
                  <template #suffix>
                    <el-icon class="red" v-if="station.trend.e10 === 'up'">
                      <CaretTop/>
                    </el-icon>
                    <el-icon class="green" v-if="station.trend.e10 === 'down'">
                      <CaretBottom/>
                    </el-icon>
                  </template>
                </el-statistic>
              </el-col>
              <el-col :span="7">
                <el-statistic title="Super" :value="station.super" :precision="3">
                  <template #suffix>
                    <el-icon class="red" v-if="station.trend.super === 'up'">
                      <CaretTop/>
                    </el-icon>
                    <el-icon class="green" v-if="station.trend.super === 'down'">
                      <CaretBottom/>
                    </el-icon>
                  </template>
                </el-statistic>
              </el-col>
              <el-col :span="7">
                <el-statistic title="Diesel" :value="station.diesel" :precision="3">
                  <template #suffix>
                    <el-icon class="red" v-if="station.trend.diesel === 'up'">
                      <CaretTop/>
                    </el-icon>
                    <el-icon class="green" v-if="station.trend.diesel === 'down'">
                      <CaretBottom/>
                    </el-icon>
                  </template>
                </el-statistic>
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
