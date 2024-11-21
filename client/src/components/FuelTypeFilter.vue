<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-radio-group v-model="fuelType"
                      size="small"
                      @change="handleChangeFuelType"
      >
        <el-radio-button label="E10" value="e10"/>
        <el-radio-button label="Super" value="super"/>
        <el-radio-button label="Diesel" value="diesel"/>
      </el-radio-group>
    </el-col>
  </el-row>
</template>

<script setup>
import { onMounted, ref } from 'vue';


const emits = defineEmits(['onChange']);

const fuelType = ref(null);

const handleChangeFuelType = (val) => {
  localStorage.setItem('fuelTypeFilter', val);

  emits('onChange', val)
};

onMounted(() => {
  const defaultFuelType = localStorage.getItem('fuelTypeFilter');

  if(defaultFuelType){
    fuelType.value = defaultFuelType
  } else{
    fuelType.value = 'e10'
  }
})
</script>

<style lang="scss" scoped>

</style>