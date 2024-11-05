<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
  >
    <el-form-item label="Address" prop="address">
      <el-input v-model="ruleForm.address" autocomplete="off"/>
    </el-form-item>
    <el-form-item label="Name" prop="name">
      <el-input v-model="ruleForm.name" autocomplete="off"/>
    </el-form-item>

    <el-form-item label="City" prop="city">
      <el-select
        v-model="ruleForm.city"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="item in citiesList"
          :key="item.id"
          :label="item.name + ', ' + item.postCode"
          :value="item"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="Station id" prop="stationIdFromApi">
      <el-input v-model="ruleForm.stationIdFromApi" autocomplete="off"/>
    </el-form-item>

    <el-row>
      <el-col>
        <el-form-item label="Location latitude" prop="latitude">
          <el-input v-model="ruleForm.location.latitude" autocomplete="off"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Location longitude" prop="longitude">
          <el-input v-model="ruleForm.location.longitude" autocomplete="off"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="Location plusCode" prop="plusCode">
          <el-input v-model="ruleForm.location.plusCode" autocomplete="off"/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="Location plusCode" prop="plusCode">
      <el-input v-model="textarea" type="textarea" autocomplete="off"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary"
                 :loading="pending"
                 @click="submitForm(ruleFormRef)"
      >
        Submit
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRaw } from 'vue';
import { getCities, createFuelStation } from '@/api/services/main.service.js';


const ruleFormRef = ref();
const citiesList = ref();
const pending = ref(false);
const textarea = ref('');

const validateEmpty = (rule, value, callback) => {
  if (value !== '') {
    callback();
  } else {
    callback(new Error('Cant be empty'));
  }
};

const ruleForm = reactive({
  address: '',
  name: '',
  city: null,
  stationIdFromApi: '',
  location: {
    latitude: null,
    longitude: null,
    plusCode: null
  },
});

const rules = reactive({
  address: [ {validator: validateEmpty, trigger: 'blur'} ],
  name: [ {validator: validateEmpty, trigger: 'blur'} ],
  city: [ {validator: validateEmpty, trigger: 'blur'} ],
  stationIdFromApi: [ {validator: validateEmpty, trigger: 'blur'} ],
});

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        pending.value = true;
        console.log('submit!', ruleForm);
        await createFuelStation(toRaw(ruleForm));
      } catch (e) {
        console.log(e);
      } finally {
        pending.value = false;
      }
    } else {
      console.log('error submit!');
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(async () => {
  const cities = await getCities();
  citiesList.value = cities.data;
});
</script>
