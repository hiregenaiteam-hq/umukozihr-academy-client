import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--glass-bg)] text-[var(--text-secondary)] border-[var(--glass-border)]',
    success: 'bg-[var(--primary)]/20 text-[var(--primary-light)] border-[var(--primary)]/30',
    warning: 'bg-[var(--accent)]/20 text-[var(--accent-light)] border-[var(--accent)]/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-[var(--secondary)]/20 text-[var(--secondary-light)] border-[var(--secondary)]/30',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
