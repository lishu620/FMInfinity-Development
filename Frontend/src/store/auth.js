import { defineStore } from "pinia";
import axios from "axios";

const api = axios.create({
  // 开发模式需要配置代理后端到端口3000
  baseURL: "http://localhost:3000/api",
  // 部署模式使用下面的配置
  // baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    isLoading: false,
    isUserFetched: false,
  }),

  actions: {
    async login(username, password) {
      this.isLoading = true;
      try {
        const { data } = await api.post("/auth/login", { username, password });
        this.token = data.token;
        this.user = data.user;
        this.isUserFetched = true;
        localStorage.setItem("token", data.token);
        return true;
      } catch (err) {
        throw err.response?.data?.message || "登录失败";
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUser() {
      if (!this.token) {
        this.user = null;
        this.isUserFetched = true;
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        this.user = data;
      } catch (err) {
        this.logout();
      } finally {
        this.isUserFetched = true;
      }
    },

    async initAuth() {
      if (!this.isUserFetched) {
        await this.fetchUser();
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.isUserFetched = true;
      localStorage.removeItem("token");
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.token,
    isSuperAdmin: (state) => state.user?.isSuperAdmin || false,
    isGroupAdmin: (state) => state.user?.isGroupAdmin || false,
  },
});

export default api;
