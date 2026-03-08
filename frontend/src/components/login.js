// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { FaBolt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiOutlineChartBar, HiOutlineCursorClick, HiOutlineUserGroup } from 'react-icons/hi';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [setImageErrors] = useState({});

    // Carousel images/data - ALL slides now use Unsplash images
    const slides = [
        {
            id: 1,
            title: "Real-Time Signal Analytics",
            description: "Monitor and analyze customer signals in real-time with interactive dashboards",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
            icon: <HiOutlineChartBar className="text-5xl text-white/90" />
        },
        {
            id: 2,
            title: "Signal-Based Marketing",
            description: "Target customers based on their intent signals for higher conversion rates",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
            icon: <HiOutlineCursorClick className="text-5xl text-white/90" />
        },
        {
            id: 3,
            title: "Customer Journey Tracking",
            description: "Track every customer interaction across web visits, purchases, and more",
            imageUrl: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&auto=format&fit=crop",
            icon: <HiOutlineUserGroup className="text-5xl text-white/90" />
        },
        {
            id: 4,
            title: "Advanced Analytics",
            description: "Deep insights into signal patterns with beautiful visualizations",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
            icon: <HiOutlineChartBar className="text-5xl text-white/90" />
        },
        {
            id: 5,
            title: "Marketing Intelligence",
            description: "Make data-driven decisions with comprehensive signal intelligence",
            imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop",
            icon: <HiOutlineChartBar className="text-5xl text-white/90" />
        }
    ];

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        setTimeout(() => {
            setIsLoading(false);
            if (email && password) {
                onLogin();
            }
        }, 1500);
    };

    const handleImageError = (slideId) => {
        setImageErrors(prev => ({ ...prev, [slideId]: true }));
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            
            {/* LEFT SIDE - Carousel/Slideshow with Darkened Images (50% width) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
                
                {/* Background Images with Dark Overlay */}
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-5000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {/* Image with Darkening and Blur Effects */}
                        <div className="absolute inset-0">
                            {/* Main Image */}
                            <img 
                                src={slide.imageUrl}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(slide.id)}
                            />
                            
                            {/* Multiple Overlay Layers for Darkening and Blur */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 mix-blend-overlay"></div>
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
                            
                            {/* Company Logo - Top Left */}
                            <div className="absolute top-8 left-8 flex items-center gap-2 z-20">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">

                                    <FaBolt className="text-white text-sm" />
                                </div>
                                <span className="text-white font-bold text-2xl drop-shadow-lg">
                                    Grow <span className="text-3xl text-white">+</span>
                                </span>
                            </div>

                            {/* Centered Content */}
                            <div className="relative z-10 max-w-lg mx-auto text-center transform translate-y-[-5%]">
                                
                                {/* Icon with Background */}
                                <div className="mb-8">
                                    <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                                        <div className="text-6xl text-white/90">
                                            {slide.icon}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Title with Text Shadow */}
                                <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-2xl">
                                    {slide.title}
                                </h2>
                                
                                {/* Description with Better Readability */}
                                <p className="text-xl text-white/90 mb-8 drop-shadow-lg max-w-md mx-auto leading-relaxed">
                                    {slide.description}
                                </p>
                                
                                {/* Feature Pills with Glass Effect */}
                                <div className="flex gap-3 justify-center flex-wrap">
                                    <span className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/20 shadow-lg">
                                        ⚡ Real-time
                                    </span>
                                    <span className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/20 shadow-lg">
                                        🤖 AI-Powered
                                    </span>
                                    <span className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/20 shadow-lg">
                                        📊 Analytics
                                    </span>
                                </div>
                            </div>

                            {/* Navigation Dots - Bottom Center */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`transition-all duration-300 ${
                                            index === currentSlide
                                                ? 'w-10 h-2.5 bg-white'
                                                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
                                        } rounded-full backdrop-blur-sm`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {/* RIGHT SIDE - Login Form (50% width) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
                <div className="w-full max-w-md">
                    
                    {/* Mobile Logo (visible only on mobile) */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-3xl">G</span>
                        </div>
                    </div>

                    {/* Header Text */}
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Sign in to your account to access the Signal Dashboard
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Email Field */}
                        <div>
                            <label className="input-label">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="input-label">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="input-field pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                            </label>
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {/* Demo Credentials */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">
                                    Demo Credentials
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm">
                            <p className="text-slate-600 dark:text-slate-400 mb-2">
                                Use these credentials to test:
                            </p>
                            <div className="space-y-1 font-mono text-xs">
                                <p><span className="text-slate-500">Email:</span> demo@grow.com</p>
                                <p><span className="text-slate-500">Password:</span> password123</p>
                            </div>
                            
                        </div>

                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                            >
                                Sign up
                            </button>
                        </p>
                    </form>

                    {/* Footer */}
                    <p className="mt-8 text-center text-xs text-slate-400">
                        © 2026 Grow+. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;