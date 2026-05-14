'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GradeGaugeProps {
  score: number;
  grade: string;
}

export default function GradeGauge({ score, grade }: GradeGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    const duration = 1000;
    const start = 0;
    const end = score;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const getGradeColor = (score: number) => {
    if (score >= 90) return '#10B981'; // accent (green)
    if (score >= 80) return '#3B82F6'; // secondary (blue)
    if (score >= 60) return '#F59E0B'; // warning (amber)
    return '#EF4444'; // danger (red)
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="transparent"
            stroke="#E2E8F0"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            fill="transparent"
            stroke={getGradeColor(score)}
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl font-bold font-mono text-primary"
          >
            {grade}
          </motion.span>
          <span className="text-sm font-medium text-text-secondary mt-1">
            {displayScore}/100
          </span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-xl font-bold text-text-primary">Your Online Visibility</h2>
        <p className="text-text-secondary max-w-xs">
          {score >= 80 
            ? "You're doing okay but missing critical leads" 
            : "Your business is leaking revenue every day."}
        </p>
      </div>
    </div>
  );
}
