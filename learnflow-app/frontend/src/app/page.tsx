/**
 * LearnFlow Landing Page
 * Main landing page with hero section and features
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StarfieldBackground from '@/components/StarfieldBackground';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <StarfieldBackground density="high" shootingStars={true}>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Hero Section */}
          <div
            className={`transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                LearnFlow
              </h1>
              <p className="text-xl md:text-2xl text-purple-200">
                AI-Powered Python Learning Platform
              </p>
            </div>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Master Python with personalized AI tutoring, interactive exercises,
              and real-time feedback. Your journey to coding excellence starts here.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/dashboard"
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transition-all"
              >
                Start Learning
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
              <Link
                href="/analytics"
                className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg font-semibold text-white hover:bg-gray-700/50 hover:border-purple-500/50 transition-all"
              >
                View Demo
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                {
                  icon: '🤖',
                  title: 'AI-Powered Tutoring',
                  description: 'Get instant help with concepts, debugging, and code reviews from our intelligent tutor.',
                },
                {
                  icon: '💻',
                  title: 'Interactive Coding',
                  description: 'Practice with real code exercises in our browser-based editor with instant execution.',
                },
                {
                  icon: '📊',
                  title: 'Progress Tracking',
                  description: 'Monitor your learning journey with detailed analytics and achievement badges.',
                },
                {
                  icon: '🎯',
                  title: 'Personalized Learning',
                  description: 'Adaptive curriculum that adjusts to your pace and learning style.',
                },
                {
                  icon: '🏆',
                  title: 'Gamification',
                  description: 'Earn XP, badges, and maintain streaks to stay motivated.',
                },
                {
                  icon: '🔥',
                  title: 'Real-Time Feedback',
                  description: 'Get immediate feedback on your code with detailed explanations.',
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 hover:bg-gray-900/50 transition-all group"
                  style={{
                    transitionDelay: `${idx * 100}ms`,
                  }}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-t border-b border-purple-500/20">
              {[
                { value: '100+', label: 'Interactive Exercises' },
                { value: '8', label: 'Learning Modules' },
                { value: '∞', label: 'AI Tutor Access' },
                { value: '24/7', label: 'Available Anytime' },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="mt-16 p-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-purple-200 mb-6 max-w-xl mx-auto">
                Join thousands of learners mastering Python with LearnFlow.
                No credit card required.
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StarfieldBackground>
  );
}
