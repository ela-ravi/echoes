import React, { useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { Input } from "../../components/atoms/Input";
import { Button } from "../../components/atoms/Button";
import { Select } from "../../components/atoms/Select";
import HeaderNav from "../../components/organisms/HeaderNav";
import PageContainer from "../../components/atoms/PageContainer";
import { API_ENDPOINTS } from "../../config/api";

const Registration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    userType: "ADMIN",
    profilePhoto: null as File | null,
  });

  const [date, setDate] = useState<Date | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const userTypeOptions = [
    { value: "ADMIN", label: "ADMIN" },
    { value: "CLIENT", label: "CLIENT" },
    { value: "JOURNALIST", label: "JOURNALIST" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      userType: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: e.target.files![0],
      }));
    }
  };

  const handleDateChange = (
    value: Date | null | [Date | null, Date | null],
  ) => {
    // Handle both single date and range selection (we only care about single date here)
    const selectedDate = Array.isArray(value) ? value[0] : value;

    setDate(selectedDate);
    setFormData((prev) => ({
      ...prev,
      dob: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("type", formData.userType.toUpperCase());

      if (formData.profilePhoto) {
        formDataToSend.append("photo", formData.profilePhoto);
      }

      const response = await fetch(API_ENDPOINTS.USER.REGISTER(), {
        method: "POST",
        body: formDataToSend,
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      // Extract password from the success message
      const passwordMatch = data.message.match(/password\s+(\d+)/i);
      if (passwordMatch && passwordMatch[1]) {
        setGeneratedPassword(passwordMatch[1]);
      }

      // Clear the form
      setFormData({
        name: "",
        email: "",
        phone: "",
        dob: "",
        userType: "ADMIN",
        profilePhoto: null,
      });
      setDate(null);

      // Show success message
      setRegistrationSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    }
  };

  return (
    <PageContainer className="min-h-screen bg-[var(--color-bg-header)] text-[var(--color-text-primary)]">
      <HeaderNav showLoginButton hideSearch={true} />

      <div className="flex justify-center w-full px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2 max-w-2xl"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Registration</h2>

          <div className="mb-4">
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              containerClass="w-full bg-[var(--color-bg-card)] border-none rounded-xl h-14 px-2 text-[var(--color-text-primary)] placeholder-[var(--color-text-placeholder)] focus:ring-0 content-center"
              required
            />
          </div>

          <div className="mb-4">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              containerClass="w-full bg-[var(--color-bg-card)] border-none rounded-xl h-14 px-2 text-[var(--color-text-primary)] placeholder-[var(--color-text-placeholder)] focus:ring-0 content-center"
              required
            />
          </div>

          <div className="mb-4">
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              containerClass="w-full bg-[var(--color-bg-card)] border-none rounded-xl h-14 px-2 text-[var(--color-text-primary)] placeholder-[var(--color-text-placeholder)] focus:ring-0 content-center"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Date of Birth
            </label>
            <div className="date-picker-container h-14 bg-[var(--color-bg-card)] border-none rounded-xl px-2 text-[var(--color-text-primary)] placeholder-[var(--color-text-placeholder)] focus:ring-0 content-center">
              <DatePicker
                onChange={handleDateChange}
                value={date}
                format="dd/MM/yyyy"
                clearIcon={null}
                dayPlaceholder="DD"
                monthPlaceholder="MM"
                yearPlaceholder="YYYY"
                maxDate={new Date()}
                className="w-full text-sm/6"
              />
            </div>
          </div>

          <div className="mb-4">
            <Select
              id="userType"
              value={formData.userType}
              onChange={handleSelectChange}
              options={userTypeOptions}
              containerClass="w-full bg-[var(--color-bg-card)] border-none rounded-xl h-14 px-2 py-2 text-[var(--color-text-primary)] focus:ring-0"
              className="border-transparent w-full"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Upload Photo (PNG, JPEG)
            </label>
            <div className="border border-dashed border-[var(--color-ui-border-light)] rounded-xl text-center">
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="profilePhoto"
                className="cursor-pointer block p-8"
              >
                <p className="text-lg font-bold mb-2">
                  Click or drag to upload
                </p>
                <p className="text-sm text-[var(--color-text-placeholder)]">
                  PNG, JPEG up to 5MB
                </p>
              </label>
              {formData.profilePhoto && (
                <p className="mt-2 text-sm text-green-400">
                  Selected: {formData.profilePhoto.name}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full h-12 rounded-full text-sm font-bold tracking-[0.015em] bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] !text-[var(--color-text-secondary)]"
          >
            Register
          </Button>

          {registrationSuccess && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
              <p className="font-bold">Registration successful!</p>
              {generatedPassword && (
                <p className="mt-2">
                  Your password is:{" "}
                  <span className="font-mono bg-green-50 px-2 py-1 rounded">
                    {generatedPassword}
                  </span>
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </PageContainer>
  );
};

export default Registration;
