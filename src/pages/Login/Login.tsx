import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/atoms/Input";
import { Button } from "../../components/atoms/Button";
import HeaderNav from "../../components/organisms/HeaderNav";
import PageContainer from "../../components/atoms/PageContainer";
import { authService } from "../../services/authService";
import { API_BASE_URL } from "../../config/api";
import { fetchUserInfo } from "../../services/newsService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const controller = new AbortController();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (API_BASE_URL !== "http://localhost:3001") {
        await authService.login(formData.email, formData.password);
        const userInfo = await fetchUserInfo(controller.signal);
        navigate(userInfo.type === "CLIENT" ? "/client-news" : "/news");
      } else {
        // await authService.login(formData.email, formData.password);
        sessionStorage.setItem("userType", "ADMIN");
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during login. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password navigation
    console.log("Forgot password clicked");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-[var(--color-text-primary)] flex flex-col">
      <HeaderNav hideSearch={true} />

      <PageContainer className="flex-1 flex items-center justify-center py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-[512px] py-5">
          <h2 className="text-[var(--color-text-primary)] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
            Welcome back
          </h2>

          <div className="mb-4">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              containerClass="w-full bg-[var(--color-bg-card)] border-none rounded-xl h-14 px-2 text-[var(--color-text-placeholder)] placeholder-[var(--color-text-placeholder)] focus:ring-0 py-2 content-center"
              required
            />
          </div>

          <div className="mb-1">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              containerClass="w-full bg-[var(--color-bg-card)] border-none rounded-xl h-14 px-2 text-[var(--color-text-placeholder)] placeholder-[var(--color-text-placeholder)] focus:ring-0 py-2 content-center"
              required
            />
          </div>

          <p
            className="text-[var(--color-text-placeholder)] text-sm font-normal leading-normal pb-3 pt-1 px-4 underline cursor-pointer hover:text-white transition-colors"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </p>
          <div className="px-4 py-3">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className={`w-full h-10 rounded-full text-sm font-bold tracking-[0.015em] ${
                isLoading
                  ? "bg-[var(--color-button-disabled)] cursor-not-allowed"
                  : "bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)]"
              }`}
            >
              {isLoading ? "Logging in..." : "Submit"}
            </Button>
          </div>

          <p className="text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
            New User?{" "}
            <span
              className="underline cursor-pointer transition-colors hover:text-white"
              onClick={handleRegister}
            >
              <Button
                type="button"
                variant="secondary"
                className="w-full bg-[var(--color-button-secondary)] hover:bg-[var(--color-button-secondary-hover)] text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Register here
              </Button>
            </span>
          </p>

          {error && (
            <div className="px-4 py-2 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </form>
      </PageContainer>
    </div>
  );
};

export default Login;
