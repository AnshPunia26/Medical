import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(`📝 Field updated: ${e.target.name} = "${e.target.value}"`);
    console.log("📋 Current form state:", { email: form.email, password: form.password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    console.log("🚀 Form submitted!");
    console.log("📋 Form data at submit:", form);

    try {
      console.log("🚀 Attempting signup with:", { email: form.email, password: "***hidden***" });
      console.log("🔗 API Endpoint:", API_ENDPOINTS.SIGNUP);
      
      // Send only email and password - all other data will be collected in onboarding
      const response = await axios.post(API_ENDPOINTS.SIGNUP, {
        email: form.email,
        password: form.password
      });

      console.log("✅ Signup successful:", response.data);
      
      setSuccess("Account created successfully! Setting up your profile...");
      
      // Store email for onboarding process
      localStorage.setItem("signupEmail", form.email);
      
      // Redirect directly to onboarding after 1 second
      setTimeout(() => {
        navigate("/onboarding");
      }, 1000);

    } catch (error) {
      console.error("❌ Signup error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError(`Signup failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    console.log("Navigate to login");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white relative">
      {/* Back Button */}
      <button
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition"
        onClick={() => navigate("/")}
        aria-label="Back to landing"
        type="button"
      >
        <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* Main Content */}
      <div className="pt-14 flex flex-col items-center">
        <h1 className="text-xl font-semibold text-black tracking-wide mb-16">Medico</h1>
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-sm">
            <br /><br />
            <h2 className="text-2xl font-bold text-black text-center mb-8">Create an account</h2>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Email"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    placeholder="Password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              {success && <div className="text-green-600 text-sm text-center">{success}</div>}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-xl font-semibold mt-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Sign up"}
              </button>
            </form>
            <div className="text-center mt-6 text-sm">
              <span className="text-gray-600">Already registered? </span>
              <button
                className="text-black font-medium hover:underline bg-transparent border-none p-0"
                onClick={handleNavigateToLogin}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-6 mt-10">
        <div className="text-center text-xs text-gray-400">
          By continuing, you agree to our{" "}
          <button className="underline hover:text-gray-600 bg-transparent border-none p-0 text-xs">Terms of Service</button> and{" "}
          <button className="underline hover:text-gray-600 bg-transparent border-none p-0 text-xs">Privacy Policy</button>.
        </div>
      </footer>
    </div>
  );
}
