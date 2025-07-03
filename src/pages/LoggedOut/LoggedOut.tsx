import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoggedOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any remaining session data
    sessionStorage.clear();
  }, []);

  const handleLoginAgain = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-2xl font-bold mb-4">You&apos;ve been logged out</h1>
      <p className="mb-6">
        Thank you for using our service. You have been successfully logged out.
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-[var(--color-text-primary)] font-bold py-2 px-4 rounded mt-4"
        onClick={handleLoginAgain}
      >
        Log in again
      </button>
    </div>
  );
};

export default LoggedOut;
