import React from 'react';

interface MorphicCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'indigo' | 'cyan' | 'emerald' | 'none';
  onClick?: () => void;
  interactive?: boolean;
}

export const MorphicCard: React.FC<MorphicCardProps> = ({
  children,
  className = '',
  glow = 'none',
  onClick,
  interactive = false,
}) => {
  const glowStyles = {
    none: '',
    indigo: 'relative before:absolute before:-inset-px before:bg-gradient-to-r before:from-indigo-500/20 before:to-purple-500/20 before:rounded-2xl before:blur-sm before:-z-10',
    cyan: 'relative before:absolute before:-inset-px before:bg-gradient-to-r before:from-cyan-500/20 before:to-blue-500/20 before:rounded-2xl before:blur-sm before:-z-10',
    emerald: 'relative before:absolute before:-inset-px before:bg-gradient-to-r before:from-emerald-500/20 before:to-teal-500/20 before:rounded-2xl before:blur-sm before:-z-10',
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-xl p-5 ${interactive ? 'glass-card-interactive' : ''} ${glowStyles[glow]} ${className}`}
    >
      {children}
    </div>
  );
};

export const MorphicBadge: React.FC<{
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
}> = ({ label, variant = 'neutral', size = 'sm' }) => {
  const styles = {
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    error: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    info: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    purple: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    neutral: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full backdrop-blur-md uppercase tracking-wider ${sizes[size]} ${styles[variant]}`}
    >
      {label}
    </span>
  );
};
