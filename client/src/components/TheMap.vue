<template>
  <div ref="mapContainerRef"
       class="stations-map"
  />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const props = defineProps([ 'city', 'fuelType', 'fuelStations' ]);
const emits = defineEmits([ 'onMoveEnd', 'onClickMarker' ]);

const mapRef = ref(null);
const mapContainerRef = ref(null);
const zoom = ref(10);
const defaultMapCenter = [ 13.41053, 52.52437 ]; //Berlin

const markers = ref([]);

const userLocation = ref(null);
const isNeedToUpdate = ref(true);
const prevCenter = ref(null);
const geolocationButtonTriggered = ref(false);

// const mapCenter = computed(() => {
//   if (props.city) {
//     return [ props.city.location.longitude, props.city.location.latitude ];
//   }
//
//   return defaultMapCenter;
// });

const stationMarker = (data) => {
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="63" height="100" viewBox="0 0 63 100" fill="none">
<path d="M31.5035 0C14.1057 0 0 14.1041 0 31.494C0 48.8994 31.5035 100 31.5035 100C31.5035 100 63.0083 48.8994 63.0083 31.494C63.0083 14.1041 48.9089 0 31.5035 0ZM31.5051 55.8655C18.0944 55.8655 7.18207 44.9532 7.18207 31.5425C7.18207 18.1287 18.096 7.21956 31.5051 7.21956C44.9157 7.21956 55.828 18.1287 55.828 31.5425C55.828 44.9532 44.9157 55.8655 31.5051 55.8655Z" fill="currentColor"/>
<path d="M31.5051 55.8655C18.0944 55.8655 7.18207 44.9532 7.18207 31.5425C7.18207 18.1287 18.096 7.21956 31.5051 7.21956C44.9157 7.21956 55.828 18.1287 55.828 31.5425C55.828 44.9532 44.9157 55.8655 31.5051 55.8655Z" fill="white"/>
<path d="M41.2111 19.6125L44.428 22.8968V39.8811C44.428 40.1582 44.3716 40.357 44.2528 40.4744C43.9804 40.7422 43.3041 40.7249 42.9535 40.7218C42.1974 40.7218 41.6277 40.5715 41.3584 40.3038C41.1861 40.1223 41.1768 39.9391 41.1861 39.8811V23.3742H38.3403V15.2529H22.5095V44.4787H19.0625V48.5393H41.795V44.4787H38.3403V24.996H39.5565V39.8124C39.5503 39.9 39.5126 40.6859 40.1436 41.3794C40.7399 42.0196 41.6761 42.3452 42.9346 42.3452L43.1772 42.3484C43.7767 42.3484 44.7285 42.2764 45.3891 41.63C45.8289 41.1978 46.0512 40.6109 46.0512 39.8783V22.2299L42.3679 18.4731L41.2111 19.6125ZM36.3053 26.6208H24.9421V18.5027H36.3053V26.6208Z" fill="currentColor"/>
<script xmlns=""/></svg>`;

  const markerElement = document.createElement('div');

  markerElement.className = 'custom-marker';

  markerElement.classList.add(`custom-marker--price-${data.priceLevel}`);

  const price = data[props.fuelType ? props.fuelType : 'e10'].toString();

  markerElement.innerHTML = `<div class="custom-marker_wrapper">
<div class="custom-marker_icon">${icon}</div>
<div class="custom-marker_price">
${price.slice(0, price.length - 1)}
<div class="custom-marker_price-cents">${price.slice(-1)}
</div>
</div>
</div>`;

  markerElement.addEventListener('click', () => {
    emits('onClickMarker', data);
  });

  return markerElement;
};

const updateMarkers = () => {
  for (let i = 0; i < markers.value.length; i++) {
    markers.value[i].remove();
  }

  markers.value = props.fuelStations.map((item) => {
    return new mapboxgl.Marker({
      element: stationMarker(item)
    })
      .setLngLat(item.location.coordinates);
  });

  for (let i = 0; i < markers.value.length; i++) {
    markers.value[i].addTo(mapRef.value);
  }
};

watch(() => props.fuelStations, () => {
  updateMarkers();
});

watch(() => props.city, (newVal) => {
  if (newVal) {
    mapRef.value.flyTo({
      center: [ props.city.location.longitude, props.city.location.latitude ],
      zoom: zoom.value
    });
  }
});

onMounted(() => {
  mapboxgl.accessToken = 'pk.eyJ1IjoibWlsay0yLWRldiIsImEiOiJjbTNmdzdjeGkwMDh6MnFzOGsxaDRibGxyIn0.qfDvVCwBAFD1lMbOT4O9Xw';

  mapRef.value = new mapboxgl.Map({
    container: mapContainerRef.value,
    center: defaultMapCenter,
    zoom: zoom.value
  });

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
        emits('onMoveEnd', center);

        isNeedToUpdate.value = false;
        geolocationButtonTriggered.value = false;
      }
    }
  });
});

const resizeMap = () => {
  return mapRef.value.resize();
};

const flyTo = (params) => {
  return mapRef.value.flyTo(params);
};

defineExpose({
  resizeMap,
  flyTo,
});
</script>

<style>
.stations-map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.custom-marker {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
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
</style>