"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, CheckCircle2, Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast, Toaster } from "sonner";

const SignupPage = () => {
  const [formData, setFormData] = useState<{ fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    otp: string;
  }>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOTP = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    //email checking regex : 
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)){
      toast.error("Please enter a valid email address!", { description : "Make sure to use the correct email format." });
      setIsLoading(false);
      return;
    }

    //passwords match check
    if(formData.password !== formData.confirmPassword){
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }
    //password length check
    if(formData.password.length < 6 || formData.password.length > 50){
      toast.error("Password must be between 6 and 50 characters long!");
      setIsLoading(false);
      return;
    }

    //sending OTP request to server : 
    const response = await fetch('http://localhost:9000/api/auth/OTPGeneration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formData.email, username: formData.fullName, password: formData.password, confirmPassword: formData.confirmPassword  }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Failed to send OTP. Please try again.");
      console.log("OTP send failed:", data);
      setIsLoading(false);
      return;
    }
    else {
      toast.success("OTP sent successfully to your email!");
      console.log(data)
      setOtpSent(true);
      setIsLoading(false);
    }
  
  }




const handleRegister = async (e: React.FormEvent) : Promise<void> => {
  e.preventDefault();
  setIsLoading(true);

  if(formData.otp.length !== 6){
    toast.error("Please enter a valid 6-digit OTP!");
    setIsLoading(false);
    return;
  }

  //sending registration request to server :
  const response = await fetch('http://localhost:9000/api/auth/register', {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email : formData.email, OTP : formData.otp})
  });

  const data = await response.json();

  if (!response.ok) {
    toast.error(data.message || "Registration failed. Please try again.");
    console.log("Registration failed:", data);
    setIsLoading(false);
    return;
  }
  else{     
    toast.success("Registration successfull! You have also being logged in.");
    return;
  }
};

const handleGoogleSignup = () => {
  // Dummy Google OAuth logic
  alert("Redirecting to Google OAuth...");
};

const handleGithubSignup = () => {
  // Dummy GitHub OAuth logic
  alert("Redirecting to GitHub OAuth...");
};

return (
  <div className="w-full overflow-hidden">
    <Toaster position="top-right" />

    {/* Signup Section */}
    <div className="w-full min-h-screen pt-32 pb-20 px-6 bg-linear-to-br from-pink-100 via-pink-50 to-blue-200 dark:from-stone-900 dark:via-black dark:to-stone-900">
      <div className="w-full max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-3 font-space-grotesk">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-inter">
              Join Nova Bot Studio and start building amazing bots
            </p>
          </div>

          {/* Signup Form */}
          <form
            onSubmit={otpSent ? handleRegister : handleSendOTP}
            className="space-y-4"
          >
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-outfit">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="User Name"
                  required
                  disabled={otpSent}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-pink-500 dark:focus:border-pink-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 transition-colors font-inter"
                />
              </div>
            </div>

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
                  placeholder="user@example.com"
                  required
                  disabled={otpSent}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-pink-500 dark:focus:border-pink-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter"
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
                  disabled={otpSent}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-pink-500 dark:focus:border-pink-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 transition-colors font-inter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  disabled={otpSent}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5 cursor-pointer" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-outfit">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={otpSent}
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-pink-500 dark:focus:border-pink-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 transition-colors font-inter"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  disabled={otpSent}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5 cursor-pointer" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 cursor-pointer" />
                  )}
                </button>
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
              className="w-full cursor-pointer px-6 py-4 bg-linear-to-r from-pink-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-outfit"
            >
              {isLoading
                ? "Processing..."
                : otpSent
                  ? "Register"
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

          {/* Divider */}
          <div className="relative mt-6 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-inter">
                Or continue with These platforms
              </span>
            </div>
          </div>

          {/* Social Signup Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </button>
            <button
              onClick={handleGithubSignup}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <Github className="h-5 w-5" />
              Continue with GitHub
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-6 font-inter">
            By signing up, you agree to our{" "}
            <Link
              href="/terms"
              className="text-pink-600 dark:text-pink-400 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-pink-600 dark:text-pink-400 hover:underline"
            >
              Privacy Policy
            </Link>
          </p>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400 font-inter">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-pink-600 dark:text-pink-400 font-semibold hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
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

export default SignupPage;
