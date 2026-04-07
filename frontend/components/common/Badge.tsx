import { PAYMENT_BADGE, LESSON_STATUS_BADGE } from '@/lib/constants';
import type { PaymentStatus, LessonStatus } from '@/lib/types';

interface BadgeProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function Badge({ children, style, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_BADGE[status] ?? PAYMENT_BADGE['대기'];
  return (
    <Badge style={{ background: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </Badge>
  );
}

export function LessonStatusBadge({ status }: { status: LessonStatus }) {
  const cfg = LESSON_STATUS_BADGE[status] ?? LESSON_STATUS_BADGE['예정'];
  return (
    <Badge style={{ background: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </Badge>
  );
}
