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

  mapRef.value.flyTo({center: [ city.location.longitude, city.location.latitude ]});

  updateMarkers();
};
const getNearestFuelStations = async (coordinates) => {
  const gasStations = await getFuelStations({nearestTo: coordinates});
  fuelStationsList.value = gasStations.data;

  updateMarkers();
};

const updateMarkers = () => {
  for (let i = 0; i < markers.value.length; i++) {
    markers.value[i].remove();
  }

  markers.value = sortedFuelStations.value.map((item) => {
    return new mapboxgl.Marker({
      element: stationMarker(item)
    })
      .setLngLat(item.location.coordinates);
  });

  for (let i = 0; i < markers.value.length; i++) {
    markers.value[i].addTo(mapRef.value);
  }
};

const stationMarker = (data) => {
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="128" viewBox="0 0 100 128" fill="none">
<rect width="100" height="127.216" fill="url(#pattern0_822_2181)"/>
<defs>
<pattern id="pattern0_822_2181" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_822_2181" transform="matrix(0.00248469 0 0 0.00195312 -0.136082 0)"/>
</pattern>
<image id="image0_822_2181" width="512" height="512" xlink:href="data:image/png;base64,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"/>
</defs>
<script xmlns=""/></svg>`;

  const markerElement = document.createElement('div');

  markerElement.className = 'custom-marker';

  markerElement.classList.add(`custom-marker--price-${data.priceLevel}`);

  const price = data[fuelType.value].toString();

  markerElement.innerHTML = `<div class="custom-marker_wrapper">
<div class="custom-marker_icon">${icon}</div>
<div class="custom-marker_price">
${price.slice(0, price.length - 1)}
<div class="custom-marker_price-cents">${price.slice(-1)}
</div>
</div>
</div>`;

  return markerElement;
};

const sortedFuelStations = computed(() => {
  if (!middlePrices.value) return [];
  const middlePrice = parseFloat(middlePrices.value[fuelType.value]);
  fuelStationsList.value.sort((a, b) => a[fuelType.value] - b[fuelType.value]);

  return fuelStationsList.value.map((item) => {
    const rawObj = toRaw(item);
    rawObj['priceLevel'] = 'normal';

    if (rawObj[fuelType.value] < middlePrice * 0.97) {
      rawObj.priceLevel = 'good'; // Ціна на 3% або більше нижча за середню
    } else if (rawObj[fuelType.value] > middlePrice * 1.02) {
      rawObj.priceLevel = 'bad'; // Ціна на 3% або більше вища за середню
    }

    return rawObj;
  });
});

const handleChangeFuelType = () => {

  updateMarkers();
};

onMounted(async () => {
  const response = await getMiddlePrices();
  middlePrices.value = response.data;

  mapboxgl.accessToken = 'pk.eyJ1IjoibWlsay0yLWRldiIsImEiOiJjbTNmdzdjeGkwMDh6MnFzOGsxaDRibGxyIn0.qfDvVCwBAFD1lMbOT4O9Xw';

  mapRef.value = new mapboxgl.Map({
    container: mapContainerRef.value,
    center: mapCenter.value,
    zoom: zoom.value
  });

  /////////////////

  userLocation.value = new mapboxgl.GeolocateControl({
    fitBoundsOptions: {
      maxZoom: 9
    },
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: false,
    showUserHeading: false
  });

  mapRef.value.addControl(
    userLocation.value
  );

  mapRef.value.on('load', () => {
    userLocation.value.trigger();
    geolocationButtonTriggered.value = true;
    userLocation.value._geolocateButton.parentNode.style.visibility = 'hidden';

    userLocation.value._geolocateButton.addEventListener('click', () => {
      geolocationButtonTriggered.value = true;
      isNeedToUpdate.value = true;
      userLocation.value._geolocateButton.parentNode.style.visibility = 'hidden';
    });
  });

  const prevCenter = ref(null);
  const geolocationButtonTriggered = ref(false);

  mapRef.value.on('movestart', async () => {
    if (!geolocationButtonTriggered.value) {
      userLocation.value._geolocateButton.parentNode.style.visibility = 'visible';
    }
  });

  mapRef.value.on('moveend', async () => {
    const center = mapRef.value.getCenter(); // Отримуємо центр карти

    if (!prevCenter.value || (prevCenter.value[0] !== center.lng || prevCenter.value[1] !== center.lat)) {
      prevCenter.value = [ center.lng, center.lat ];

      if (isNeedToUpdate.value) {
        await getNearestFuelStations([ center.lng, center.lat ]);
        city.value = null;
        isNeedToUpdate.value = false;
        geolocationButtonTriggered.value = false;
      }
    }
  });

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

        <el-radio-group v-model="fuelType"
                        size="small"
                        @change="handleChangeFuelType"
        >
          <el-radio-button label="E10" value="e10"/>
          <el-radio-button label="Super" value="super"/>
          <el-radio-button label="Diesel" value="diesel"/>
        </el-radio-group>

        <div ref="mapContainerRef" class="stations-map" style="height:450px;"/>

        <div class="stations-list">
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
                <span v-if="fuelType === 'e10'">{{ station.priceLevel }}</span>
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
                <span v-if="fuelType === 'super'">{{ station.priceLevel }}</span>
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
                <span v-if="fuelType === 'diesel'">{{ station.priceLevel }}</span>
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
.custom-marker {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
}

.custom-marker .custom-marker_wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.custom-marker .custom-marker_icon {
  margin-bottom: -5px;
}

.custom-marker .custom-marker_icon svg {
  height: 50px;
}

.custom-marker .custom-marker_price {
  display: flex;
  border-radius: 4px;
  padding: 4px 8px;
  color: #fff;
  font-size: 14px;
}

.custom-marker .custom-marker_price-cents {
  position: relative;
  top: -6px;
  font-size: 10px;
}

.custom-marker.custom-marker--price-normal .custom-marker_price {
  background-color: #409eff;
}

.custom-marker.custom-marker--price-bad .custom-marker_price {
  background-color: #ff4d51;
}

.custom-marker.custom-marker--price-good .custom-marker_price {
  background-color: var(--el-color-success);
}

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
