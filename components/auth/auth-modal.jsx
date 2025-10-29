/**
 * @file components/auth/auth-modal.jsx
 * @author Anshi
 * @description Modal component for user authentication (sign in, sign up).
 * @lastUpdated 2025-10-14
 */
"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, signIn, resetPassword } from "@/lib/auth";
import { validatePassword } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function AuthModal({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const checkPasswordRequirements = (pwd) => {
    setPasswordRequirements({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      specialChar: /[^A-Za-z0-9]/.test(pwd),
    });
  };

  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        const passwordError = validatePassword(password);
        if (passwordError) {
          setError(passwordError);
          setLoading(false);
          toast({
            title: "Invalid Password",
            description: passwordError,
            variant: "destructive",
          });
          return;
        }
        const { data, error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes("already registered") || data && data.user && !data.session) {
            setError("This email is already registered. Please sign in.");
            toast({
              title: "Registration Failed",
              description: "This email is already registered. Please sign in or use a different email.",
              variant: "destructive",
            });
          } else {
            setError(error.message);
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          setMessage("Check your email for the confirmation link!");
          toast({
            title: "Account Created",
            description: "Please check your email for the confirmation link.",
          });
        }
      } else if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onSuccess();
          onClose();
          toast({
            title: "Welcome Back!",
            description: "You have successfully signed in.",
          });
        }
      } else if (mode === "reset") {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setMessage("Check your email for the password reset link!");
          toast({
            title: "Password Reset Link Sent",
            description: "Please check your email to reset your password.",
          });
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setError("");
    setMessage("");
    setShowPassword(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            {mode === "signin" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "reset" && "Reset Password"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-rose-400 rounded-xl"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-rose-400 rounded-xl"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {mode !== "reset" && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      checkPasswordRequirements(e.target.value);
                    }}
                    className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-rose-400 rounded-xl"
                    placeholder="Enter your password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {mode === "signup" && (
                  <div className="mt-2 text-[0.7em] text-gray-600 grid grid-cols-2 gap-x-1">
                    <p className={passwordRequirements.length ? "text-green-500" : "text-gray-500"}>
                      {passwordRequirements.length ? "✓" : "•"} At least 8 characters
                    </p>
                    <p className={passwordRequirements.uppercase ? "text-green-500" : "text-gray-500"}>
                      {passwordRequirements.uppercase ? "✓" : "•"} Contains an uppercase letter
                    </p>
                    <p className={passwordRequirements.lowercase ? "text-green-500" : "text-gray-500"}>
                      {passwordRequirements.lowercase ? "✓" : "•"} Contains a lowercase letter
                    </p>
                    <p className={passwordRequirements.number ? "text-green-500" : "text-gray-500"}>
                      {passwordRequirements.number ? "✓" : "•"} Contains a number
                    </p>
                    <p className={passwordRequirements.specialChar ? "text-green-500" : "text-gray-500"}>
                      {passwordRequirements.specialChar ? "✓" : "•"} Contains a special character
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-600 text-sm">{message}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 font-semibold shadow-lg hover:shadow-rose-500/25 transition-all duration-300 rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "signin" && "Signing In..."}
                  {mode === "signup" && "Creating Account..."}
                  {mode === "reset" && "Sending Reset Link..."}
                </>
              ) : (
                <>
                  {mode === "signin" && "Sign In"}
                  {mode === "signup" && "Create Account"}
                  {mode === "reset" && "Send Reset Link"}
                </>
              )}
            </Button>
          </form>

          <div className="space-y-3 text-center">
            {mode === "signin" && (
              <>
                <button
                  onClick={() => switchMode("reset")}
                  className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                >
                  Forgot your password?
                </button>
                <p className="text-sm text-gray-600">
                  Don’t have an account?{" "}
                  <button
                    onClick={() => switchMode("signup")}
                    className="text-rose-600 hover:text-rose-700 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}

            {mode === "signup" && (
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("signin")}
                  className="text-rose-600 hover:text-rose-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === "reset" && (
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <button
                  onClick={() => switchMode("signin")}
                  className="text-rose-600 hover:text-rose-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
