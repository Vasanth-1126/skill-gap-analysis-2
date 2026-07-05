import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface CircularProgressProps {
  score: number;
}

export default function CircularProgress({ score }: CircularProgressProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Smooth counter animation
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  // SVG parameters
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine color matching based on score tier
  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-500 stroke-emerald-500";
    if (s >= 50) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getLabel = (s: number) => {
    if (s >= 80) return { title: "High Alignment", desc: "Solid baseline of skills; minor refinements needed." };
    if (s >= 50) return { title: "Moderate Alignment", desc: "A realistic target; noticeable key gaps to bridge." };
    return { title: "High Gap Horizon", desc: "Significant skill pivot; requires dedicated structured study." };
  };

  const colorClass = getColor(score);
  const labelObj = getLabel(score);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-900">
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 drop-shadow-sm"
        >
          {/* Background circle */}
          <circle
            className="stroke-slate-100"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated score circle */}
          <motion.circle
            className={colorClass}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            transition={{ duration: 1.2, ease: "easeOut" }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute text-center flex flex-col items-center">
          <span className={`text-3xl font-display font-bold tracking-tight ${colorClass.split(' ')[0]}`}>
            {Math.round(animatedScore)}%
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-semibold">Match</span>
        </div>
      </div>
      <div className="text-center sm:text-left flex-1">
        <h3 className="text-lg font-display font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
          {labelObj.title}
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed max-w-sm">
          {labelObj.desc}
        </p>
      </div>
    </div>
  );
}
