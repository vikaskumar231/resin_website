"use client";

import React, { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, ShieldAlert, Check, Eye, EyeOff, UserPlus, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptRegister, setPromptRegister] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPromptRegister(false);
    setIsWrongPassword(false);
    setIsLoading(true);

    const res = await login(identifier, password);
    setIsLoading(false);

    if (res.success) {
      const currentUser = useAuthStore.getState().user;
      const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const callbackUrl = searchParams?.get("callbackUrl");

      if (currentUser?.role === "ARTISAN_ADMIN") {
        setSuccessToast(`👑 Welcome Master Artisan ${currentUser.name}! Admin screens unlocked.`);
        const dest = callbackUrl && callbackUrl.startsWith("/admin") ? callbackUrl : "/admin/products";
        setTimeout(() => router.push(dest), 1000);
      } else {
        setSuccessToast(`Welcome back to Artआलय${currentUser?.name ? `, ${currentUser.name}` : ""}!`);
        const dest = callbackUrl && !callbackUrl.startsWith("/admin") ? callbackUrl : "/";
        setTimeout(() => router.push(dest), 1000);
      }
    } else {
      setError(res.error || "Failed to sign in");
      if (res.promptRegister) {
        setPromptRegister(true);
      }
      if (res.wrongPassword) {
        setIsWrongPassword(true);
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPromptRegister(false);
    setIsWrongPassword(false);
    setIsLoading(true);

    const res = await register({
      name,
      username: identifier,
      email,
      password,
    });
    setIsLoading(false);

    if (res.success) {
      setSuccessToast("Account created successfully! Welcome to Artआलय.");
      setTimeout(() => router.push("/"), 1000);
    } else {
      setError(res.error || "Failed to create account");
    }
  };

  const switchToRegister = () => {
    setError(null);
    setPromptRegister(false);
    setIsWrongPassword(false);
    setActiveTab("REGISTER");
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl border border-brand-sand shadow-soft p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-emerald via-brand-teal to-brand-gold items-center justify-center text-white font-serif font-bold text-2xl shadow-md mb-3">
              आ
            </div>
            <h1 className="font-serif text-2xl font-bold text-brand-emerald">
              Sign In to Art<span className="text-brand-gold">आलय</span>
            </h1>
            <p className="text-xs text-brand-charcoal/70 mt-1">
              Hand-poured Luxury Resin Art &amp; Workshop Studio
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-brand-sand bg-brand-sand/50 p-1.5 rounded-2xl">
            <button
              onClick={() => {
                setError(null);
                setPromptRegister(false);
                setIsWrongPassword(false);
                setActiveTab("LOGIN");
              }}
              className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all ${
                activeTab === "LOGIN"
                  ? "bg-brand-emerald text-white shadow-xs"
                  : "text-brand-charcoal/70 hover:text-brand-emerald"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setError(null);
                setPromptRegister(false);
                setIsWrongPassword(false);
                setActiveTab("REGISTER");
              }}
              className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all ${
                activeTab === "REGISTER"
                  ? "bg-brand-emerald text-white shadow-xs"
                  : "text-brand-charcoal/70 hover:text-brand-emerald"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          {activeTab === "LOGIN" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
                  Username, Phone, or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-brand-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (promptRegister) setPromptRegister(false);
                    }}
                    placeholder="Enter registered username, phone, or email"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white text-brand-charcoal text-sm focus:outline-none focus:ring-2 ${
                      promptRegister
                        ? "border-amber-400 focus:ring-amber-400/30"
                        : "border-brand-sand focus:ring-brand-emerald/30"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isWrongPassword ? "text-red-500" : "text-brand-charcoal/40"}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (isWrongPassword) setIsWrongPassword(false);
                    }}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-white text-brand-charcoal text-sm focus:outline-none focus:ring-2 ${
                      isWrongPassword
                        ? "border-red-400 focus:ring-red-400/30"
                        : "border-brand-sand focus:ring-brand-emerald/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-charcoal/50 hover:text-brand-charcoal"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Dynamic Error Feedback with Registration Prompt */}
              {error && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs space-y-2.5 transition-all ${
                    promptRegister
                      ? "bg-amber-50/90 border-amber-300 text-amber-900 shadow-2xs"
                      : isWrongPassword
                      ? "bg-red-50 border-red-300 text-red-800 shadow-2xs"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isWrongPassword ? (
                      <KeyRound className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          promptRegister ? "text-amber-600" : "text-red-500"
                        }`}
                      />
                    )}
                    <div className="flex-1 leading-relaxed">
                      <p className="font-semibold">{error}</p>
                    </div>
                  </div>

                  {promptRegister && (
                    <button
                      type="button"
                      onClick={switchToRegister}
                      className="w-full mt-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Not registered yet? Click here to Register Now</span>
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-brand-emerald text-white font-bold text-sm hover:bg-brand-emerald/90 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <span>{isLoading ? "Signing in..." : "Sign In to Artआलय"}</span>
                <ArrowRight className="w-4 h-4 text-brand-gold" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-white text-brand-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
                  Username or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. priya_sharma or 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-white text-brand-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-white text-brand-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-white text-brand-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
                />
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-brand-emerald text-white font-bold text-sm hover:bg-brand-emerald/90 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <span>{isLoading ? "Creating account..." : "Create Artisan Account"}</span>
                <ArrowRight className="w-4 h-4 text-brand-gold" />
              </button>
            </form>
          )}

          {/* Success Toast */}
          {successToast && (
            <div className="p-3 bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
              <Check className="w-4 h-4 text-brand-gold shrink-0" />
              <span>{successToast}</span>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
