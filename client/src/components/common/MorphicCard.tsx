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
    indigo: 'relative before:absolute before:-inset-px before:bg-gradient-to-r before:from-indigo-200 before:to-purple-200 before:rounded-2xl before:blur-sm before:-z-10',
    cyan: 'relative before:absolute before:-inset-px before:bg-gradient-to-r before:from-cyan-200 before:to-blue-200 before:rounded-2xl before:blur-sm before:-z-10',
    emerald: 'relative before:absolute before:-inset-px before:bg-gradient-to-r before:from-emerald-200 before:to-teal-200 before:rounded-2xl before:blur-sm before:-z-10',
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
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    purple: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full uppercase tracking-wider ${sizes[size]} ${styles[variant]}`}
    >
      {label}
    </span>
  );
};
