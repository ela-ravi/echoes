import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/atoms/Input";
import { Button } from "../../components/atoms/Button";
import HeaderNav from "../../components/organisms/HeaderNav";
import PageContainer from "../../components/atoms/PageContainer";
import { authService } from "../../services/authService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      await authService.login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during login. Please try again."
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
    <div className="min-h-screen bg-[#131520] text-white">
      <HeaderNav hideSearch={true} />

      <PageContainer className="px-4 sm:px-10 md:px-40">
        <form onSubmit={handleSubmit} className="w-full max-w-[512px] py-5">
          <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
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
              containerClass="w-full bg-[#282d43] border-none rounded-xl h-14 px-2 text-white placeholder-[#99a0c2] focus:ring-0 py-2 content-center"
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
              containerClass="w-full bg-[#282d43] border-none rounded-xl h-14 px-2 text-white placeholder-[#99a0c2] focus:ring-0 py-2 content-center"
              required
            />
          </div>

          <p
            className="text-[#99a0c2] text-sm font-normal leading-normal pb-3 pt-1 px-4 underline cursor-pointer hover:text-white transition-colors"
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
                  ? "bg-[#2a44bb] cursor-not-allowed"
                  : "bg-[#304dce] hover:bg-[#2a44bb]"
              }`}
            >
              {isLoading ? "Logging in..." : "Submit"}
            </Button>
          </div>

          <p className="text-[#99a0c2] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
            New User?{" "}
            <span
              className="underline cursor-pointer hover:text-white transition-colors"
              onClick={handleRegister}
            >
              Register here
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
