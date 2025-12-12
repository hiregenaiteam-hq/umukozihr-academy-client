import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('px-6 py-5 border-b border-[var(--glass-border)]', className)} {...props}>
      {children}
    </div>
  )
}

function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('px-6 py-5', className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('px-6 py-5 border-t border-[var(--glass-border)] bg-[var(--glass-bg)]', className)} {...props}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardContent, CardFooter }
