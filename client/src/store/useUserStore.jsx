import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../pages/lib/axios";
import { useAuthStore } from "./useAuthStore";
import axios from "axios";

const API_BASE_URL = "http://localhost:9193";

const useUserStore = create((set, get) => ({
  isUpdatingProfileImage: false,
  profileImageUrl: null,
  isLoadingProfileImage: false,
  profileImageError: null,

  updateProfileImage: async (file) => {
    set({ isUpdatingProfileImage: true });
    try {
      const authUser = useAuthStore.getState().authUser;
      const token =
        useAuthStore.getState().token || useAuthStore.getState().getToken();

      if (!authUser || !authUser.id) {
        toast.error("You must be logged in to update your profile");
        return { success: false };
      }

      if (!token) {
        toast.error("Authentication token is missing");
        return { success: false };
      }

      if (!file) {
        toast.error("Please select a file to upload");
        return { success: false };
      }

      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, or GIF)");
        return { success: false };
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return { success: false };
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("image", file);
      formData.append("profileImage", file);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axiosInstance.put(
        `/users/${authUser.id}/update-profile-image`,
        formData,
        config
      );

      console.log("Server response:", response.data);

      if (response.data) {
        const currentAuthUser = useAuthStore.getState().authUser;
        let profileImagePath = null;

        if (response.data.data) {
          if (typeof response.data.data === "string") {
            if (response.data.data.includes("/api/v1/images/image/download/")) {
              profileImagePath = `${API_BASE_URL}${response.data.data}`;
            } else {
              const idMatch = response.data.data.toString().match(/\d+$/);
              if (idMatch) {
                profileImagePath = `${API_BASE_URL}/api/v1/images/image/download/${idMatch[0]}`;
              }
            }
          } else if (typeof response.data.data === "number") {
            profileImagePath = `${API_BASE_URL}/api/v1/images/image/download/${response.data.data}`;
          } else if (typeof response.data.data === "object") {
            if (response.data.data.id) {
              profileImagePath = `${API_BASE_URL}/api/v1/images/image/download/${response.data.data.id}`;
            } else if (response.data.data.downloadUrl) {
              profileImagePath = `${API_BASE_URL}${response.data.data.downloadUrl}`;
            }
          }
        }

        if (profileImagePath) {
          useAuthStore.setState({
            authUser: {
              ...currentAuthUser,
              profileImage: {
                id: response.data.data.id || response.data.data,
                downloadUrl:
                  response.data.data.downloadUrl || response.data.data,
                fileName: file.name,
                fileType: file.type,
              },
            },
          });

          set({ profileImageUrl: profileImagePath });

          toast.success("Profile image updated successfully");
          return {
            success: true,
            data: response.data,
            imageUrl: profileImagePath,
          };
        } else {
          toast.warning("Image uploaded but couldn't determine URL");
          return { success: true, data: response.data, imageUrl: null };
        }
      }
    } catch (error) {
      console.error("Error updating profile image:", error);

      let errorMessage = "Failed to update profile image";

      if (error.response) {
        console.error("Server error response:", error.response.data);
        console.error("Status code:", error.response.status);

        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please try again later.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }

      toast.error(errorMessage);
      set({ profileImageError: errorMessage });
      return { success: false, error };
    } finally {
      set({ isUpdatingProfileImage: false });
    }
  },

  getProfileImageUrl: async () => {
    set({ isLoadingProfileImage: true, profileImageError: null });

    try {
      const authUser = useAuthStore.getState().authUser;
      const token =
        useAuthStore.getState().token || useAuthStore.getState().getToken();

      if (!authUser || !authUser.profileImage) {
        set({
          profileImageUrl: null,
          isLoadingProfileImage: false,
        });
        return null;
      }

      if (!token) {
        set({
          profileImageUrl: null,
          isLoadingProfileImage: false,
          profileImageError: "Missing authentication token",
        });
        return null;
      }

      let imageUrl;

      if (typeof authUser.profileImage === "object") {
        if (authUser.profileImage.downloadUrl) {
          const downloadUrl = authUser.profileImage.downloadUrl;
          imageUrl = downloadUrl.startsWith("/")
            ? `${API_BASE_URL}${downloadUrl}`
            : downloadUrl;
        } else if (authUser.profileImage.id) {
          imageUrl = `${API_BASE_URL}/api/v1/images/image/download/${authUser.profileImage.id}`;
        }
      } else if (typeof authUser.profileImage === "string") {
        imageUrl = authUser.profileImage.startsWith("/")
          ? `${API_BASE_URL}${authUser.profileImage}`
          : authUser.profileImage;
      }
      if (imageUrl) {
        try {
          const response = await axios.get(imageUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          });
          const reader = new FileReader();
          return new Promise((resolve) => {
            reader.onloadend = () => {
              const dataUrl = reader.result;
              set({
                profileImageUrl: dataUrl,
                isLoadingProfileImage: false,
              });
              resolve(dataUrl);
            };
            reader.readAsDataURL(response.data);
          });
        } catch (error) {
          console.error("Error fetching image:", error);
          set({
            profileImageUrl: null,
            isLoadingProfileImage: false,
            profileImageError: "Could not load profile image",
          });
          return null;
        }
      } else {
        set({
          profileImageUrl: null,
          isLoadingProfileImage: false,
        });
        return null;
      }
    } catch (error) {
      console.error("Error in getProfileImageUrl:", error);
      set({
        profileImageUrl: null,
        isLoadingProfileImage: false,
        profileImageError: error.message,
      });
      return null;
    }
  },
}));

export default useUserStore;
