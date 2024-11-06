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
    <el-form-item label="Name" prop="name">
      <el-input v-model="ruleForm.name" autocomplete="off"/>
    </el-form-item>

    <el-form-item label="Post code" prop="postCode">
      <el-input v-model="ruleForm.postCode" autocomplete="off"/>
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
import { reactive, ref, toRaw } from 'vue';
import { createCity } from '@/api/services/main.service.js';


const ruleFormRef = ref();
const pending = ref(false);

const validateEmpty = (rule, value, callback) => {
  if (value !== '') {
    callback();
  } else {
    callback(new Error('Cant be empty'));
  }
};

const ruleForm = reactive({
  name: '',
  postCode: ''
});

const rules = reactive({
  postCode: [ {validator: validateEmpty, trigger: 'blur'} ],
  name: [ {validator: validateEmpty, trigger: 'blur'} ]
});

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        pending.value = true;
        console.log('submit!', ruleForm);
        await createCity(toRaw(ruleForm));
        formEl.resetFields();
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
</script>
