import type { DesignStyle } from '@/lib/style-presets'

interface StyleWrapperProps {
  style: DesignStyle
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  children: React.ReactNode
}

export function StyleWrapper({
  style,
  as: Tag = 'div',
  className,
  children,
}: StyleWrapperProps) {
  return (
    <Tag data-style={style} className={className}>
      {children}
    </Tag>
  )
}
