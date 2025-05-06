import { create } from "zustand";
import { User } from "@/database/tables";
import {
  getConfiguration,
  removeToken,
  returnPermissionsMap,
  setToken,
} from "@/lib/utils";
import { StatusEnum } from "@/lib/constants";
import axiosClient from "@/lib/axois-client";

const initUser: User = {
  id: "",
  full_name: "",
  username: "",
  email: "",
  status: StatusEnum.blocked,
  grant: false,
  profile: "",
  role: { role: 3, name: "user" },
  job: "",
  contact: "",
  destination: "",
  created_at: "",
  gender: "",
  permissions: {},
  registration_number: "",
};

interface AuthState {
  portal: 1 | 2 | 3;
  user: User;
  authenticated: boolean;
  loading: boolean;
  loginUser: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<any>;
  logoutUser: () => Promise<void>;
  setUser: (user: User) => void;
  setPortal: (portal: 1 | 2 | 3) => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  portal: 2,
  user: initUser,
  authenticated: false,
  loading: true,

  loginUser: async (email, password, rememberMe) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await axiosClient.post("auth-user", formData);
      if (response.status === 200) {
        const user = response.data.user as User;
        if (user) {
          user.permissions = returnPermissionsMap(response.data?.permissions);
        }

        if (rememberMe) {
          setToken({
            token: response.data.token,
            type: "user",
          });
        }
        const keys = Object.keys(user.permissions);
        let selectedPortal = 2;
        if (keys.length > 0) {
          selectedPortal = parseInt(keys[0]);
        }
        set({
          user,
          authenticated: true,
          loading: false,
          portal: selectedPortal == 1 ? 1 : selectedPortal == 3 ? 3 : 2,
        });
      }
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  logoutUser: async () => {
    try {
      await axiosClient.post("auth-logout");
    } catch (error) {
      console.log(error);
    }
    removeToken();
    set({
      user: initUser,
      authenticated: false,
      loading: false,
    });
  },

  setUser: (user) => {
    if (user) {
      set({ user });
    }
  },
  setPortal: (portal) => {
    if (portal) {
      set({ portal });
    }
  },

  loadUser: async () => {
    const configuration = getConfiguration();
    if (!configuration?.token) {
      set({ loading: false });
      return;
    }

    try {
      const response = await axiosClient.get(`auth-${configuration.type}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const user = response.data.user;
        if (user) {
          user.permissions = returnPermissionsMap(response.data?.permissions);
        }
        const keys = Object.keys(user.permissions);
        let selectedPortal = 2;
        if (keys.length > 0) {
          selectedPortal = parseInt(keys[0]);
        }
        set({
          user,
          authenticated: true,
          loading: false,
          portal: selectedPortal == 1 ? 1 : selectedPortal == 3 ? 3 : 2,
        });
      }
    } catch (err) {
      console.log(err);
      removeToken();
      set({
        user: initUser,
        authenticated: false,
        loading: false,
      });
    }
  },
}));
