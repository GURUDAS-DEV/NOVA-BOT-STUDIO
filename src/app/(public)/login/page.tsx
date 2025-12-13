"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, CheckCircle2, Github } from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/Store/store";

const LoginPage = () => {

  const {setAuthData} = useAuthStore();

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    otp: string;
  }>({
    email: "",
    password: "",
    otp: "",
  });
  const [loginMethod, setLoginMethod] = useState<"password" | "otp" | null>(
    null
  );
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //send OTP to email
  const handleSendOTP = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch("http://localhost:9000/api/auth/generateOTPForLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: formData.email }),
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      setIsLoading(false);
      setOtpSent(true);
      toast.success("OTP sent successfully to your email!");
    } else {
      setIsLoading(false);
      toast.error(`${data.message}`);
    }
  };


  //login via OTP
  const handleLoginWithOTP = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    if(formData.otp.length !== 6){
      setIsLoading(false);
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    const response = await fetch("http://localhost:9000/api/auth/LoginWithOTP",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({ email : formData.email, OTP: formData.otp }),
      credentials: "include",
    });

    const data = await response.json();
    console.log(data);

    if(response.ok){
      setIsLoading(false);
      toast.success("Login successful!");
      setAuthData({
        isLoggedIn: true,
        username: data.username,
        email: data.email,
      });
      window.location.href = "/home";
    } else {
      setIsLoading(false);
      toast.error(`${data.message}`);
    }
  };

  const handleLoginWithPassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch(
      "http://localhost:9000/api/auth/loginByPassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      setIsLoading(false);
      toast.success("Login successfull!");
      setAuthData({
        isLoggedIn: true,
        username: data.username,
        email: data.email,
      });
      window.location.href = "/home";
    } 
    else {
      setIsLoading(false);
      toast.error(`${data.message}`);
    }
  };

const handleGoogleLogin = async() => {
    const response = await fetch('http://localhost:9000/api/auth/googleOAuth');
    const data = await response.json();
    if(response.ok){
      window.location.href = data.url;
    }
    else{
      toast.error(data.message || "Failed to initiate Google OAuth. Please try again later.");
    }
};

  const handleGithubLogin = async () => {
    const response = await fetch('http://localhost:9000/api/auth/githubOAuth');
    const data = await response.json();
    if(response.ok){
      window.location.href = data.url;
    }
    else{
      toast.error(data.message || "Failed to initiate Google OAuth. Please try again later.");
    }
  };

  const resetLoginMethod = (): void => {
    setLoginMethod(null);
    setOtpSent(false);
    setFormData({
      email: "",
      password: "",
      otp: "",
    });
  };

  return (
    <div className="w-full overflow-hidden">
      <Toaster position="top-right" duration={3000} richColors/>
      {/* Login Section */}
      <div className="w-full min-h-screen pt-32 pb-20 px-6 bg-linear-to-br from-blue-50 via-white to-pink-50 dark:from-stone-900 dark:via-black dark:to-stone-900">
        <div className="w-full max-w-md mx-auto">
          {/* Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-black dark:text-white mb-3 font-space-grotesk">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-inter">
                Log in to your Nova Bot Studio account
              </p>
            </div>

            {/* Login Method Selection */}
            {!loginMethod ? (
              <div className="space-y-4 mb-8">
                {/* Password Login Option */}
                <button
                  onClick={() => setLoginMethod("password")}
                  className="w-full p-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                      <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-base font-semibold text-black dark:text-white font-outfit">
                        Login with Password
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                        Use your email and password
                      </p>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                  </div>
                </button>

                {/* OTP Login Option */}
                <button
                  onClick={() => setLoginMethod("otp")}
                  className="w-full p-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-900/30 group-hover:bg-pink-200 dark:group-hover:bg-pink-800/50 transition-colors">
                      <CheckCircle2 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-base font-semibold text-black dark:text-white font-outfit">
                        Login with OTP
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                        Get a code sent to your email
                      </p>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                  </div>
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-inter">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleGoogleLogin}
                    className="cursor-pointer w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    <FcGoogle className="h-5 w-5" />
                    Continue with Google
                  </button>
                  <button
                    onClick={handleGithubLogin}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    <Github className="h-5 w-5" />
                    Continue with GitHub
                  </button>
                </div>
              </div>
            ) : loginMethod === "password" ? (
              // Password Login Form
              <form onSubmit={handleLoginWithPassword} className="space-y-4">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={resetLoginMethod}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-inter mb-4"
                >
                  ← Back to login options
                </button>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-outfit">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 transition-colors font-inter"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-outfit">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-12 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 transition-colors font-inter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-inter"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-outfit"
                >
                  {isLoading ? "Logging In..." : "Log In with Password"}
                </button>
              </form>
            ) : (
              // OTP Login Form
              <form
                onSubmit={otpSent ? handleLoginWithOTP : handleSendOTP}
                className="space-y-4"
              >
                {/* Back Button */}
                <button
                  type="button"
                  onClick={resetLoginMethod}
                  className="text-sm text-pink-600 dark:text-pink-400 hover:underline font-inter mb-4"
                >
                  ← Back to login options
                </button>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-outfit">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      disabled={otpSent}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-pink-500 dark:focus:border-pink-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                    />
                  </div>
                </div>

                {/* OTP Field (shown after OTP is sent) */}
                {otpSent && (
                  <div className="animate-in slide-in-from-top duration-300">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-outfit">
                      Enter OTP
                    </label>
                    <div className="relative">
                      <CheckCircle2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        required
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-pink-500 dark:focus:border-pink-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 transition-colors font-inter"
                      />
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-inter">
                      ✓ OTP sent successfully to your email
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer px-6 py-4 bg-linear-to-r from-pink-600 to-pink-700 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-outfit"
                >
                  {isLoading
                    ? "Processing..."
                    : otpSent
                    ? "Log In with OTP"
                    : "Send OTP"}
                </button>

                {/* Resend OTP (shown after OTP is sent) */}
                {otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="w-full text-center text-sm text-pink-600 dark:text-pink-400 hover:underline font-inter"
                  >
                    Didn&apos;t receive OTP? Resend
                  </button>
                )}
              </form>
            )}

            {/* Signup Link */}
            {!loginMethod && (
              <div className="text-center mt-6">
                <p className="text-gray-600 dark:text-gray-400 font-inter">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
              🔒 Your data is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
