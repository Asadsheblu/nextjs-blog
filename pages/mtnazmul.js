import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { FaEnvelope, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
// import signIn from "../public/login.svg";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import signIn from "../public/login.svg";
function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/dashbaord/dashbaord");
    }
  }, []);

  const handleSubmitLogin = (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (email === "admin@gmail.com" && password === "admin") {
      toast.success("Login successful!");
      localStorage.setItem("user", JSON.stringify({ email }));
      router.push("/dashbaord/dashbaord");
    } else {
      toast.error("Invalid email or password");
      setError("Invalid email or password");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl">
        <ToastContainer />
        {/* Illustration Section */}
        <div className="hidden md:block md:w-1/2">
          <Image src={signIn} alt="Illustration" className="w-4/4 h-auto" />
        </div>
        {/* Form Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/2">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">Login</h2>
          <p className="text-center text-gray-600 mb-6">Welcome Back! Sign in to continue to YTubeTool.</p>
          <form onSubmit={handleSubmitLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 mb-2">
                <FaEnvelope className="inline-block text-red-500 mr-2" /> Email
              </label>
              <input
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-gray-600 mb-2">
                <FaKey className="inline-block text-red-500 mr-2" /> Password
              </label>
              <input
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-3 pt-4 top-10 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200 w-full mb-4"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        
        </div>
      </div>
    </div>
  );
}

export default Login;
