<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">登录系统</h2>

      <el-form @submit.prevent="handleLogin" class="login-form">
        <el-form-item>
          <el-input
            v-model="username"
            placeholder="账号"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="password"
            type="password"
            placeholder="密码"
            size="large"
            show-password
          />
        </el-form-item>

        <div v-if="error" class="error-tip">{{ error }}</div>

        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            size="large"
            class="login-btn"
          >
            {{ loading ? "登录中..." : "登录" }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-link">
        没有账号？<a @click="$router.push('/register')">立即注册</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  loading.value = true;
  error.value = "";
  try {
    await authStore.login(username.value, password.value);
    router.push("/");
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.login-box {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
}

.login-form {
  width: 100%;
}

.error-tip {
  color: #f56c6c;
  font-size: 12px;
  text-align: center;
  margin-bottom: 10px;
}

.login-btn {
  width: 100%;
}

.login-link {
  text-align: center;
  font-size: 13px;
  margin-top: 10px;
}
a {
  color: #409eff;
  cursor: pointer;
}
</style>
