import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Card({ children, className, onClick, style }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-[#f0f0f0]',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform',
        className
      )}
      style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)', ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
