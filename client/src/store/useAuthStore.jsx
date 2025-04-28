import {create} from 'zustand';
import toast from "react-hot-toast";
import {axiosInstance} from '../pages/lib/axios'
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      token: null, 
      isSigningUp: false,
      isLoggingIn: false,
      isUpdating: false,
      isChekingAuth: true,
      
      register: async (userData) => {
        set({isSigningUp: true});
        try {
          const res = await axiosInstance.post("/auth/register", userData);
          
          toast.success(res.data.message || "Registration successful! Please check your email for verification.");
          return {success: true, data: res.data};
          
        } catch (error) {
          console.error("Registration error:", error);
          toast.error(error.response?.data?.message || "Registration failed. Please try again.");
          return {success: false, error};
        } finally {
          set({isSigningUp: false});
        }
      },
      
      verifyEmail: async (token) => {
        try {
          const res = await axiosInstance.get(`/auth/register/confirmToken?token=${token}`);
          toast.success(res.data.message || "Email verified successfully!");
          return {success: true};
        } catch (error) {
          console.error("Verification error:", error);
          toast.error(error.response?.data?.message || "Verification failed. Please try again.");
          return {success: false, error};
        }
      },

      login: async (email, password) => {
        set({isLoggingIn: true});
        try {
          const data = { email, password };
          
          const res = await axiosInstance.post("/auth/login", data);
          const userData = res.data.data;
          
          set({
            authUser: {
              id: userData.id,
            },
            token: userData.token
          });
          
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
          
          toast.success(res.data.message || "Login successful");
          
          try {
            const userRes = await axiosInstance.get("/auth/check");
            if (userRes.data.success) {
              const userDataWithoutPassword = { ...userRes.data.data };
              delete userDataWithoutPassword.password;
              
              set({ authUser: userDataWithoutPassword });
            }
          } catch (userError) {
            console.error("Failed to fetch complete user data:", userError);
          }

        } catch (error) {
          console.error("Login error:", error);
          toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
          set({isLoggingIn: false});
        }
      },
      
      logout: () => {
        delete axiosInstance.defaults.headers.common['Authorization'];
        
        set({
          authUser: null,
          token: null
        });
        
        toast.success("Logged out successfully");
      },
      
      getToken: () => get().token,
      
      isLoggedIn: () => !!get().token,

      checkAuth: async () => {
        set({ isChekingAuth: true });
        try {
          const token = get().token;
          
          if (!token) {
            set({ isChekingAuth: false });
            return false;
          }
          
          if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          
          const res = await axiosInstance.get("/auth/check");
          
          if (res.data.success) {
            const userDataWithoutPassword = { ...res.data.data };
            delete userDataWithoutPassword.password;
            
            set({ 
              authUser: userDataWithoutPassword 
            });
            return true;
          } else {
            set({ authUser: null, token: null });
            return false;
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          set({ authUser: null, token: null });
          return false;
        } finally {
          set({ isChekingAuth: false });
        }
      }
    }),
    {
      name: 'auth-storage', 
      partialize: (state) => ({ 
        authUser: state.authUser,
        token: state.token 
      }), 
    }
  )
);

export const setupAuthInterceptor = () => {
  const token = useAuthStore.getState().token;
  
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};