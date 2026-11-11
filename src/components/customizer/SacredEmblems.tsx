import React from "react";

interface EmblemProps {
  className?: string;
  size?: number;
}

export function GaneshaEmblem({ className = "", size = 28 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lord Ganesha Sacred Emblem"
    >
      <defs>
        <linearGradient id="goldGradGanesha" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#996515" />
        </linearGradient>
      </defs>
      {/* Crown (Mukut) */}
      <path
        d="M24 4L28 12H20L24 4Z"
        fill="url(#goldGradGanesha)"
      />
      {/* Head & Ears */}
      <path
        d="M14 16C12 18 10 22 12 25C14 28 17 27 18 25C19 23 20 20 24 20C28 20 29 23 30 25C31 27 34 28 36 25C38 22 36 18 34 16C31 13 27 12 24 12C21 12 17 13 14 16Z"
        fill="url(#goldGradGanesha)"
      />
      {/* Trunk (Vakratunda) */}
      <path
        d="M22 22C22 26 23 32 23 35C23 38 25 40 28 40C30 40 31 39 31 37C31 35 29 35 28 36C27 36 26 35 26 33C26 30 25 25 25 22"
        stroke="url(#goldGradGanesha)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Modak */}
      <circle cx="34" cy="35" r="3" fill="url(#goldGradGanesha)" />
      {/* Tilak */}
      <path d="M24 14V17M22 15H26" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function SwastikEmblem({ className = "", size = 28 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Auspicious Swastik Emblem"
    >
      <defs>
        <linearGradient id="goldGradSwastik" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#996515" />
        </linearGradient>
      </defs>
      {/* Core Auspicious Swastika Lines */}
      <path
        d="M24 8V40M8 24H40M24 8H36M40 24V36M24 40H12M8 24V12"
        stroke="url(#goldGradSwastik)"
        strokeWidth="4"
        strokeLinecap="square"
      />
      {/* 4 Sacred Dots (Bindus) */}
      <circle cx="16" cy="16" r="2" fill="url(#goldGradSwastik)" />
      <circle cx="32" cy="16" r="2" fill="url(#goldGradSwastik)" />
      <circle cx="16" cy="32" r="2" fill="url(#goldGradSwastik)" />
      <circle cx="32" cy="32" r="2" fill="url(#goldGradSwastik)" />
    </svg>
  );
}

export function LotusEmblem({ className = "", size = 28 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sacred Lotus Emblem"
    >
      <defs>
        <linearGradient id="goldGradLotus" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#996515" />
        </linearGradient>
      </defs>
      {/* Central Petal */}
      <path
        d="M24 8C20 16 19 26 24 36C29 26 28 16 24 8Z"
        fill="url(#goldGradLotus)"
      />
      {/* Left Petal */}
      <path
        d="M22 17C15 20 10 27 12 34C16 35 20 33 22 28"
        fill="url(#goldGradLotus)"
        opacity="0.9"
      />
      {/* Right Petal */}
      <path
        d="M26 17C33 20 38 27 36 34C32 35 28 33 26 28"
        fill="url(#goldGradLotus)"
        opacity="0.9"
      />
      {/* Outer Flared Base Petals */}
      <path
        d="M12 34C7 32 4 36 8 39C14 41 20 37 21 34"
        fill="url(#goldGradLotus)"
        opacity="0.8"
      />
      <path
        d="M36 34C41 32 44 36 40 39C34 41 28 37 27 34"
        fill="url(#goldGradLotus)"
        opacity="0.8"
      />
    </svg>
  );
}

export function EvilEyeEmblem({ className = "", size = 28 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Protective Evil Eye Emblem"
    >
      <defs>
        <linearGradient id="goldGradEye" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#996515" />
        </linearGradient>
      </defs>
      {/* Outer Eye Almond Contour */}
      <path
        d="M6 24C12 14 36 14 42 24C36 34 12 34 6 24Z"
        stroke="url(#goldGradEye)"
        strokeWidth="3.5"
        fill="rgba(15, 56, 49, 0.4)"
      />
      {/* Concentric Circles */}
      <circle cx="24" cy="24" r="8" fill="#FFFFFF" />
      <circle cx="24" cy="24" r="5" fill="#1A535C" />
      <circle cx="24" cy="24" r="2.5" fill="#0F3831" />
      <circle cx="25.5" cy="22.5" r="1" fill="#FFFFFF" />
    </svg>
  );
}

