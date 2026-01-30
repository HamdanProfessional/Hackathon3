/**
 * Starfield Background Component
 * Provides an animated starfield background with nebula effects
 */

'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  active: boolean;
}

interface StarfieldBackgroundProps {
  children: React.ReactNode;
  className?: string;
  density?: 'low' | 'medium' | 'high';
  shootingStars?: boolean;
}

export default function StarfieldBackground({
  children,
  className = '',
  density = 'medium',
  shootingStars = true
}: StarfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // Star configuration based on density
    const getStarCount = () => {
      switch (density) {
        case 'low': return 50;
        case 'medium': return 150;
        case 'high': return 300;
        default: return 150;
      }
    };

    // Initialize stars
    const initStars = () => {
      starsRef.current = [];
      const count = getStarCount();

      for (let i = 0; i < count; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          speed: Math.random() * 0.5 + 0.1,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }
    };

    const shootingStarsRef = useRef<ShootingStar[]>([]);

    const initShootingStars = () => {
      shootingStarsRef.current = [];
      for (let i = 0; i < 3; i++) {
        shootingStarsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 10 + 15,
          opacity: 0,
          active: false
        });
      }
    };

    // Animation loop
    let lastTime = 0;
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f0f23');
      gradient.addColorStop(0.5, '#1a1a3e');
      gradient.addColorStop(1, '#0f0f23');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add nebula glow
      const nebulaGradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.4, 0,
        canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.5
      );
      nebulaGradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
      nebulaGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)');
      nebulaGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      const time = timestamp * 0.001;
      starsRef.current.forEach(star => {
        // Update position
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        // Update twinkle
        star.opacity = 0.5 + Math.sin(time * star.twinkleSpeed * 100 + star.twinklePhase) * 0.3;

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Add glow for larger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.2})`;
          ctx.fill();
        }
      });

      // Draw shooting stars
      if (shootingStars) {
        shootingStarsRef.current.forEach((sStar, index) => {
          // Randomly activate shooting stars
          if (!sStar.active && Math.random() < 0.002) {
            sStar.active = true;
            sStar.x = Math.random() * canvas.width;
            sStar.y = Math.random() * canvas.height * 0.3;
            sStar.opacity = 1;
          }

          if (sStar.active) {
            // Update position
            sStar.x += sStar.speed;
            sStar.y += sStar.speed * 0.6;
            sStar.opacity -= 0.02;

            // Deactivate if faded or off screen
            if (sStar.opacity <= 0 || sStar.x > canvas.width || sStar.y > canvas.height) {
              sStar.active = false;
            } else {
              // Draw shooting star
              const gradient = ctx.createLinearGradient(
                sStar.x, sStar.y,
                sStar.x - sStar.length, sStar.y - sStar.length * 0.6
              );
              gradient.addColorStop(0, `rgba(255, 255, 255, ${sStar.opacity})`);
              gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

              ctx.beginPath();
              ctx.moveTo(sStar.x, sStar.y);
              ctx.lineTo(sStar.x - sStar.length, sStar.y - sStar.length * 0.6);
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          }
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    if (shootingStars) {
      initShootingStars();
    }

    // Handle resize
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [density, shootingStars]);

  return (
    <div className={`relative min-h-screen ${className}`}>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10"
        style={{ background: 'transparent' }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
