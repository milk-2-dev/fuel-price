<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-select
        v-model="city"
        value-key="id"
        placeholder="Select city"
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
    </el-col>
  </el-row>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getCities } from '@/api/services/main.service.js';


const emits = defineEmits(['onChange'])

const city = ref(null);
const citiesList = ref(null);

const handleChangeCity = (val) => {
  emits('onChange', val)
}

onMounted(async () => {
  const cities = await getCities();
  citiesList.value = cities.data;
});
</script>

<style lang="scss" scoped>

</style>