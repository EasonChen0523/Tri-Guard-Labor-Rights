import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <a 
      href="/" 
      className={`${className} block relative group transition-transform hover:scale-110 duration-300 cursor-pointer`}
      aria-label="回到首頁"
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-xl">
        {/* Shield Base (Protection) */}
        <path 
          d="M50 5 L15 20 C15 20 15 55 15 65 C15 85 50 95 50 95 C50 95 85 85 85 65 C85 55 85 20 85 20 L50 5Z" 
          fill="white" 
          stroke="#1e293b" 
          strokeWidth="1"
        />
        
        {/* Tri-Guard Lines (The Three Agencies) */}
        {/* Labor Insurance (Blue) */}
        <path 
          d="M30 30 Q50 20 70 30" 
          stroke="#3b82f6" 
          strokeWidth="6" 
          strokeLinecap="round"
          className="animate-pulse"
        />
        {/* Labor Inspection (Amber) */}
        <path 
          d="M25 45 Q50 35 75 45" 
          stroke="#f59e0b" 
          strokeWidth="6" 
          strokeLinecap="round"
        />
        {/* Tax Bureau (Red) */}
        <path 
          d="M30 60 Q50 50 70 60" 
          stroke="#ef4444" 
          strokeWidth="6" 
          strokeLinecap="round"
        />

        {/* Legal Symbol (Scale/Justice Gavel Symbolism) */}
        <circle cx="50" cy="78" r="5" fill="#1e293b" />
        <rect x="48" y="70" width="4" height="15" rx="2" fill="#1e293b" />
        <path d="M40 75 L60 75" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full -z-10 group-hover:bg-indigo-500/40 transition-colors"></div>
    </a>
  );
};

export default Logo;