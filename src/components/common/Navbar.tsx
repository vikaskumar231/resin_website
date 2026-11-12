"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  LogIn,
  UserPlus,
  Crown,
  ChevronDown,
  LogOut,
  Tag,
  ClipboardList,
  FolderTree,
  User,
  Truck,
  Package,
} from "lucide-react";
import TrackOrderModal from "@/components/common/TrackOrderModal";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const customerDropdownRef = useRef<HTMLDivElement>(null);

  const cart = useCartStore();
  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();
  const itemCount = cart.getItemCount();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAdminDropdownOpen(false);
      }
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target as Node)) {
        setCustomerDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isArtisanAdmin = user?.role === "ARTISAN_ADMIN";

  return (
    <header className="sticky top-0 z-40 bg-brand-ivory/90 backdrop-blur-md border-b border-brand-sand/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
        {/* Brand Logo & Devanagari Monogram */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-emerald via-brand-teal to-brand-gold flex items-center justify-center text-brand-gold shadow-md group-hover:scale-105 transition-transform">
            <span className="font-serif text-xl font-bold tracking-tighter text-white">आ</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-serif font-bold text-brand-emerald tracking-wide flex items-center gap-1">
              Art<span className="text-brand-gold font-serif">आलय</span>
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-brand-charcoal/60 font-sans -mt-1 font-semibold">
              Hand-poured Luxury Resin
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-brand-charcoal">
          <Link href="/#catalog" className="hover:text-brand-gold transition-colors">
            Collections
          </Link>
          <Link href="/#artisan-story" className="hover:text-brand-gold transition-colors">
            Artisan Story
          </Link>
          <Link href="/#proof-process" className="hover:text-brand-gold transition-colors">
            Proof Guarantee
          </Link>
          <button
            onClick={() => setTrackModalOpen(true)}
            className="flex items-center gap-1.5 hover:text-brand-gold transition-colors font-semibold text-brand-charcoal"
          >
            <Truck className="w-4 h-4 text-brand-teal" />
            <span>Track Order</span>
          </button>
        </nav>

        {/* Right CTA / Auth / Bag Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* HIGH-VISIBILITY AUTHENTICATION BUTTONS */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Sign In CTA */}
              <button
                onClick={() => openAuthModal("LOGIN")}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-bold text-brand-emerald bg-brand-sand/70 hover:bg-brand-sand border border-brand-sand transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-brand-teal" />
                <span>Sign In</span>
              </button>

              {/* Register CTA */}
              <button
                onClick={() => openAuthModal("REGISTER")}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-brand-emerald bg-white hover:bg-brand-emerald hover:text-white border-2 border-brand-emerald/80 shadow-xs transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Logged In Admin / Customer Badge Pill */}
              {isArtisanAdmin ? (
                <button
                  onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500/15 via-brand-emerald/15 to-teal-500/15 border border-brand-gold/50 text-brand-emerald font-bold text-xs shadow-xs hover:border-brand-gold transition-all"
                >
                  <Crown className="w-4 h-4 text-brand-gold shrink-0 animate-bounce" />
                  <span className="font-serif">{user?.name?.split(" ")[0]} (Admin)</span>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-gold" />
                </button>
              ) : (
                <div className="relative" ref={customerDropdownRef}>
                  <button
                    onClick={() => setCustomerDropdownOpen(!customerDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-sand hover:bg-white border border-brand-sand text-xs font-semibold text-brand-emerald shadow-xs transition-all"
                  >
                    <User className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{user?.name?.split(" ")[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-brand-teal/70" />
                  </button>

                  {/* Customer Dropdown Menu */}
                  {customerDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-brand-ivory rounded-2xl shadow-xl border border-brand-sand p-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-brand-sand/60 mb-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                          Customer Account
                        </p>
                        <p className="text-xs font-serif font-bold text-brand-emerald truncate">
                          {user?.name}
                        </p>
                        {user?.email && (
                          <p className="text-[10px] text-brand-charcoal/60 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>

                      <Link
                        href="/account/orders"
                        onClick={() => setCustomerDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-charcoal hover:bg-brand-emerald/10 hover:text-brand-emerald transition-colors"
                      >
                        <Package className="w-4 h-4 text-brand-teal" />
                        <span>My Orders &amp; Invoices</span>
                      </Link>

                      <button
                        onClick={() => {
                          setCustomerDropdownOpen(false);
                          setTrackModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-charcoal hover:bg-brand-emerald/10 hover:text-brand-emerald transition-colors text-left"
                      >
                        <Truck className="w-4 h-4 text-brand-teal" />
                        <span>Track by Order #</span>
                      </button>

                      <div className="border-t border-brand-sand/60 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setCustomerDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Admin Dropdown Menu */}
              {adminDropdownOpen && isArtisanAdmin && (
                <div className="absolute right-0 mt-2 w-56 bg-brand-ivory rounded-2xl shadow-xl border border-brand-sand p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-brand-sand/60 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                      Artisan Admin Suite
                    </p>
                    <p className="text-xs font-serif font-bold text-brand-emerald">
                      {user?.name}
                    </p>
                  </div>

                  <Link
                    href="/admin/categories"
                    prefetch={false}
                    onClick={() => setAdminDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-charcoal hover:bg-brand-emerald/10 hover:text-brand-emerald transition-colors"
                  >
                    <FolderTree className="w-4 h-4 text-brand-teal" />
                    Categories CMS
                  </Link>

                  <Link
                    href="/admin/products"
                    prefetch={false}
                    onClick={() => setAdminDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-charcoal hover:bg-brand-emerald/10 hover:text-brand-emerald transition-colors"
                  >
                    <Tag className="w-4 h-4 text-brand-teal" />
                    Catalog CMS
                  </Link>

                  <Link
                    href="/admin/orders/ord_01/job-sheet"
                    prefetch={false}
                    onClick={() => setAdminDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-charcoal hover:bg-brand-emerald/10 hover:text-brand-emerald transition-colors"
                  >
                    <ClipboardList className="w-4 h-4 text-brand-teal" />
                    Order Job Sheet
                  </Link>

                  <div className="border-t border-brand-sand/60 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setAdminDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Explore Collections CTA */}
          <Link
            href="/#catalog"
            className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-emerald text-brand-sand hover:bg-brand-teal shadow-soft transition-all"
          >
            Collections
          </Link>

          {/* Cart Bag Button */}
          <button
            onClick={() => cart.setCartOpen(true)}
            className="relative p-2.5 rounded-full bg-brand-sand hover:bg-white text-brand-emerald border border-brand-sand transition-colors"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gold text-brand-emerald font-bold text-[11px] rounded-full flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-brand-emerald hover:text-brand-gold focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-ivory border-b border-brand-sand px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          {/* Mobile Auth Callout */}
          <div className="p-3.5 bg-white rounded-2xl border border-brand-sand shadow-xs">
            {!isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal("LOGIN");
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-brand-emerald text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <LogIn className="w-4 h-4 text-brand-gold" />
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal("REGISTER");
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-brand-sand border border-brand-emerald text-brand-emerald font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-brand-gold" />
                    <div>
                      <p className="text-xs font-bold text-brand-emerald font-serif">
                        {user?.name}
                      </p>
                      <p className="text-[10px] text-brand-charcoal/60">
                        Role: {user?.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-xs text-red-600 font-bold px-3 py-1 rounded-lg hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>

                {isArtisanAdmin ? (
                  <div className="pt-2 border-t border-brand-sand grid grid-cols-3 gap-1.5 text-[11px]">
                    <Link
                      href="/admin/categories"
                      prefetch={false}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-brand-sand/60 text-brand-emerald font-semibold flex items-center justify-center gap-1 text-center"
                    >
                      <FolderTree className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                      <span>Categories</span>
                    </Link>
                    <Link
                      href="/admin/products"
                      prefetch={false}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-brand-sand/60 text-brand-emerald font-semibold flex items-center justify-center gap-1 text-center"
                    >
                      <Tag className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                      <span>Catalog</span>
                    </Link>
                    <Link
                      href="/admin/orders/ord_01/job-sheet"
                      prefetch={false}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-brand-sand/60 text-brand-emerald font-semibold flex items-center justify-center gap-1 text-center"
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                      <span>Job Sheet</span>
                    </Link>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-brand-sand">
                    <Link
                      href="/account/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-brand-sand/60 text-brand-emerald font-semibold flex items-center gap-2 text-xs"
                    >
                      <Package className="w-4 h-4 text-brand-teal" />
                      <span>My Orders &amp; Invoices</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setTrackModalOpen(true);
            }}
            className="w-full flex items-center gap-3 text-base font-semibold text-brand-charcoal p-2 rounded-xl hover:bg-brand-sand/50 text-left"
          >
            <Truck className="w-5 h-5 text-brand-teal" />
            <span>Track Order</span>
          </button>
          <Link
            href="/#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-brand-charcoal p-2"
          >
            Collections
          </Link>
          <Link
            href="/#artisan-story"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-brand-charcoal p-2"
          >
            The Artisan Story
          </Link>
          <Link
            href="/#proof-process"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-brand-charcoal p-2"
          >
            WhatsApp Customization Workflow
          </Link>
        </div>
      )}

      {/* Universal Track Order Modal */}
      <TrackOrderModal isOpen={trackModalOpen} onClose={() => setTrackModalOpen(false)} />
    </header>
  );
}
