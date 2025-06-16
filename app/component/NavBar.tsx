"use client";
import {
  Search,
  User,
  ChevronDown,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-4 py-3 md:px-6 shadow-xl border-b border-gray-700/50 relative z-20">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-blue-500 rounded-full blur-2xl animate-pulse delay-700" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <button
            className="text-gray-400 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-white font-semibold text-xl hidden sm:block">
            Dashboard
          </h1>
        </div>

        {/* Center Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <Search
            size={18}
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isSearchFocused ? "text-purple-400" : "text-gray-400"
            }`}
          />
          <input
            type="text"
            placeholder="Search projects, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 backdrop-blur-sm ${
              isSearchFocused
                ? "border-purple-500 focus:ring-purple-500/30 bg-white/10"
                : "border-gray-600 hover:border-gray-500"
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 md:space-x-5">
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-xl group"
              aria-haspopup="true"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center font-semibold text-sm text-white">
                SR
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-300 ${
                  isProfileOpen
                    ? "rotate-180 text-white"
                    : "group-hover:text-white"
                }`}
              />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 animate-slideDown">
                <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center font-semibold text-sm text-white flex-shrink-0">
                    SR
                  </div>
                  <div>
                    <p className="text-white font-medium">Salt River</p>
                    <p className="text-gray-400 text-xs">
                      saltriveradtskerala@gmail.com
                    </p>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-white/5">
                    <User size={18} />
                    <span className="ml-3">Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-white/5">
                    <Settings size={18} />
                    <span className="ml-3">Preferences</span>
                  </button>
                </div>
                <div className="border-t border-gray-700 py-2">
                  <button className="w-full flex items-center px-4 py-2 text-red-400 hover:bg-red-500/10">
                    <LogOut size={18} />
                    <span className="ml-3">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search + dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none"
          />
          <div className="space-y-2">
            <button className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-white/5">
              <User size={18} />
              <span className="ml-3">Profile</span>
            </button>
            <button className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-white/5">
              <Settings size={18} />
              <span className="ml-3">Preferences</span>
            </button>
            <button className="w-full flex items-center px-4 py-2 text-red-400 hover:bg-red-500/10">
              <LogOut size={18} />
              <span className="ml-3">Sign Out</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
