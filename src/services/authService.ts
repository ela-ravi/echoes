import { API_ENDPOINTS, getHeaders } from "../config/api";

export interface LoginResponse {
  status: string;
  message: string;
}

export const authService = {
  /**
   * Logs out the current user by invalidating the session token
   * @returns Promise that resolves when logout is complete
   */
  /**
   * Logs in a user with email and password
   * @param email User's email
   * @param password User's password
   * @returns Promise that resolves with the login response
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(API_ENDPOINTS.USER.LOGIN(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        email,
        pwd: password,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== "SUCCESS") {
      throw new Error(data.message || "Login failed");
    }

    // Store token in session storage
    if (data.message) {
      sessionStorage.setItem("tkn", data.message);
    }

    return data;
  },

  /**
   * Logs out the current user by invalidating the session token
   * @returns Promise that resolves when logout is complete
   */
  logout: async (): Promise<void> => {
    try {
      const response = await fetch(API_ENDPOINTS.USER.LOGOUT(), {
        method: "POST",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the API call fails, we should still clear the local session
    } finally {
      // Clear all session storage
      sessionStorage.clear();
      // Redirect to logged out page
      window.location.href = "/logged-out";
    }
  },
};

export default authService;
