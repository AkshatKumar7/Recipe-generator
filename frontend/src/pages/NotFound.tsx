import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
          <h1 className="text-6xl font-extrabold text-[#5f6fff] mb-4 font-montserrat">404</h1>
          <p className="text-lg text-[#4f4f6d] mb-8 font-inter">Page not found.</p>
          <a href="/" className="text-[#5f6fff] hover:underline font-montserrat">Go Home</a>
          Return to Home
      </div>
    </div>

    </>
  );
};

export default NotFound;
