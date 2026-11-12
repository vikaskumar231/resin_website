"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { X, Lock, User, ShieldAlert, Check, Eye, EyeOff, ArrowRight, UserPlus, KeyRound } from "lucide-react";

export default function AuthModal() {
  const router = useRouter();
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    openAuthModal,
    login,
    register,
  } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [promptRegister, setPromptRegister] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

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
      if (currentUser?.role === "ARTISAN_ADMIN") {
        setSuccessToast(`👑 Welcome Master Artisan ${currentUser.name}! Admin screens unlocked.`);
        setTimeout(() => {
          setSuccessToast(null);
          closeAuthModal();
          window.location.href = "/admin/products";
        }, 800);
      } else {
        setSuccessToast(`Welcome back to Artआलय${currentUser?.name ? `, ${currentUser.name}` : ""}!`);
        setTimeout(() => {
          setSuccessToast(null);
          closeAuthModal();
        }, 1500);
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
      setSuccessToast("Welcome to Artआलय! Account created.");
      setTimeout(() => setSuccessToast(null), 2000);
    } else {
      setError(res.error || "Failed to create account");
    }
  };

  const switchToRegister = () => {
    setError(null);
    setPromptRegister(false);
    setIsWrongPassword(false);
    openAuthModal("REGISTER");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-brand-ivory rounded-3xl border border-brand-sand shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-brand-sand flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-emerald via-brand-teal to-brand-gold flex items-center justify-center text-white font-serif font-bold text-base shadow-xs">
              आ
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-brand-emerald leading-tight">
                Art<span className="text-brand-gold">आलय</span> Account
              </h3>
              <p className="text-[11px] text-brand-charcoal/60">
                Hand-poured Luxury Resin Decor &amp; Workshop
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full hover:bg-brand-sand text-brand-charcoal transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-brand-sand bg-white/40 p-1.5">
          <button
            onClick={() => {
              setError(null);
              setPromptRegister(false);
              setIsWrongPassword(false);
              openAuthModal("LOGIN");
            }}
            className={`flex-1 py-2 text-center rounded-2xl text-xs font-bold transition-all ${
              authModalTab === "LOGIN"
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
              openAuthModal("REGISTER");
            }}
            className={`flex-1 py-2 text-center rounded-2xl text-xs font-bold transition-all ${
              authModalTab === "REGISTER"
                ? "bg-brand-emerald text-white shadow-xs"
                : "text-brand-charcoal/70 hover:text-brand-emerald"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Form */}
          {authModalTab === "LOGIN" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
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
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
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

          {/* Success Toast Banner */}
          {successToast && (
            <div className="p-3 bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
              <Check className="w-4 h-4 text-brand-gold shrink-0" />
              <span>{successToast}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
