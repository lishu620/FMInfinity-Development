<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      <img style="width: 100px" src="../images/logo.svg" alt="logo" />
    </el-menu-item>

    <div class="greeting-text" v-if="authStore.isLoggedIn">
      {{ greeting }}, {{ authStore.user?.nickname }}
    </div>

    <el-menu-item index="1">首页</el-menu-item>
    <el-menu-item
      index="2"
      v-if="['admin', '文案组'].includes(authStore.user?.group)"
    >
      稿件管理
    </el-menu-item>
    <el-menu-item index="4">稿件投票</el-menu-item>
    <el-menu-item index="5">文案编辑</el-menu-item>
    <el-sub-menu index="6">
      <template #title>公共查询</template>
      <el-menu-item index="6-1">文案展示</el-menu-item>
      <el-menu-item index="6-2">稿件状态</el-menu-item>
      <el-menu-item index="6-3">歌姬查看</el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="3" v-if="authStore.user?.isGroupAdmin == 1">
      <template #title>管理界面</template>
      <el-menu-item index="3-1">用户管理</el-menu-item>
      <el-menu-item index="3-2" v-if="authStore.user?.isSuperAdmin"
        >组管理</el-menu-item
      >
      <el-menu-item index="3-3">歌姬管理</el-menu-item>
    </el-sub-menu>

    <div class="right-menu">
      <el-menu-item index="10" v-if="!authStore.isLoggedIn" class="login-btn">
        登录
      </el-menu-item>

      <template v-else>
        <el-menu-item index="11">个人主页</el-menu-item>
        <el-menu-item index="12" @click="logout">注销</el-menu-item>
      </template>
    </div>
  </el-menu>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const router = useRouter();
const authStore = useAuthStore();
const activeIndex = ref("1");

// 问候语
const greeting = computed(() => {
  if (!authStore.isLoggedIn) return "";
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "早上好";
  if (hour >= 12 && hour < 18) return "下午好";
  if (hour >= 18 && hour < 24) return "晚上好";
  return "凌晨好";
});

// 菜单
const handleSelect = (key) => {
  switch (key) {
    case "0":
    case "1":
      router.push("/");
      break;
    case "2":
      router.push("/issues");
      break;
    case "4":
      router.push("/vote");
      break;
    case "5":
      router.push("/review");
      break;
    case "6-1":
      router.push("/show");
      break;
    case "6-2":
      router.push("/submission-status");
      break;
    case "6-3":
      router.push("/vsinger-show");
      break;
    case "3-1":
      router.push("/admin-console");
      break;
    case "3-2":
      router.push("/group-console");
      break;
    case "3-3":
      router.push("/vsinger-console");
      break;
    case "10":
      router.push("/login");
      break;
    case "11":
      router.push("/profile");
      break;
  }
};

// 注销
const logout = () => {
  authStore.logout();
  router.push("/login");
};

// 路由高亮
onMounted(() => {
  const path = router.currentRoute.value.path;
  if (path === "/") activeIndex.value = "1";
  if (path === "/issues") activeIndex.value = "2";
  if (path === "/vote") activeIndex.value = "4";
  if (path === "/admin-console") activeIndex.value = "3-1";
  if (path === "/profile") activeIndex.value = "11";
});
</script>

<style scoped>
.el-menu-demo {
  display: flex;
  align-items: center;
}

.greeting-text {
  color: #333;
  font-size: 14px;
  padding: 0 15px;
  line-height: 60px;
  white-space: nowrap;
}

.right-menu {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.login-btn {
  color: #409eff !important;
  font-weight: 500;
}
</style>
