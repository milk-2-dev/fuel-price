<script setup>
import { computed, onMounted, ref } from 'vue';

import 'leaflet/dist/leaflet.css';
import { LMap, LMarker, LTileLayer, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet';

import { getCities, getFuelStations } from '@/api/services/main.service.js';

const city = ref(null);
const citiesList = ref(null);
const fuelStationsList = ref(null);

const zoom = ref(10);
const defaultMapCenter = [ 52.520008, 13.404954 ]; //Berlin
const isMapHovered = ref(false);

const mapCenter = computed(() => {
  if (city.value) {
    return [ city.value.location.latitude, city.value.location.longitude ];
  }

  return defaultMapCenter;
});

const handleChangeCity = async (city) => {
  const gasStations = await getFuelStations(city.id);
  fuelStationsList.value = gasStations.data;
};

onMounted(async () => {
  const cities = await getCities();
  citiesList.value = cities.data;
});

const handleMouseOverMap = () => {
  isMapHovered.value = true;
};
const handleMouseOutMap = () => {
  isMapHovered.value = false;
};
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="12" :offset="6">
      <el-space direction="vertical" :fill="true" style="width: 100%">
        <div class="stations-map" style="height:450px;">
          <l-map ref="map"
                 v-model:zoom="zoom"
                 :center="mapCenter"
                 :useGlobalLeaflet="false"
                 @preclick="handleMouseOverMap"
                 @mouseout="handleMouseOutMap"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            >
            </l-tile-layer>

            <l-marker v-for="station in fuelStationsList"
                      :lat-lng="[station.location.latitude, station.location.longitude]"
                      title="some title"
                      alt="some alt"
                      :riseOnHover="true">
              <l-popup>
                <h3>{{ station.name }}</h3>
                <!--                <p>-->
                <!--                  <span>{{ station.open }}</span> - <span>{{ station.close }}</span>-->
                <!--                </p>-->
                <p>Street: {{ station.address }}</p>

              </l-popup>
              <l-tooltip>{{ station.name }}</l-tooltip>
            </l-marker>
          </l-map>
        </div>

        <div class="stations-list" :class="isMapHovered ? null : 'list-to-top'">
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
                <el-statistic title="e10" :value="station.e10">
                  <!--                  <template #suffix>-->
                  <!--                    <el-icon class="green" v-if="station.trend.e10 === 'up'">-->
                  <!--                      <CaretTop/>-->
                  <!--                    </el-icon>-->
                  <!--                    <el-icon class="red" v-if="station.trend.e10 === 'down'">-->
                  <!--                      <CaretBottom/>-->
                  <!--                    </el-icon>-->
                  <!--                  </template>-->
                </el-statistic>
              </el-col>
              <el-col :span="7">
                <el-statistic title="Super" :value="station.super">
                  <!--                  <template #suffix>-->
                  <!--                    <el-icon class="green" v-if="station.trend.super === 'up'">-->
                  <!--                      <CaretTop/>-->
                  <!--                    </el-icon>-->
                  <!--                    <el-icon class="red" v-if="station.trend.super === 'down'">-->
                  <!--                      <CaretBottom/>-->
                  <!--                    </el-icon>-->
                  <!--                  </template>-->
                </el-statistic>
              </el-col>
              <el-col :span="7">
                <el-statistic title="Diesel" :value="station.diesel">
                  <!--                  <template #suffix>-->
                  <!--                    <el-icon class="green" v-if="station.trend.diesel === 'up'">-->
                  <!--                      <CaretTop/>-->
                  <!--                    </el-icon>-->
                  <!--                    <el-icon class="red" v-if="station.trend.diesel === 'down'">-->
                  <!--                      <CaretBottom/>-->
                  <!--                    </el-icon>-->
                  <!--                  </template>-->
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
