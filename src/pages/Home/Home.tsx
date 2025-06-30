import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = sessionStorage.getItem("tkn");
    const userType = sessionStorage.getItem("userType");

    if (token && userType) {
      console.log("Token and UserType are available:", userType);
      // Redirect based on user type
      switch (userType) {
        case "ADMIN":
          navigate("/news");
          break;
        case "CLIENT":
          navigate("/client-news");
          break;
        case "JOURNALIST":
          // Redirect to journalist page when created
          navigate("/news");
          break;
        default:
          navigate("/login");
      }
    } else {
      console.log("Token and UserType are not available");
      // If not logged in, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  // Show a simple loading message while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Echoes</h1>
        <p>Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default Home;
