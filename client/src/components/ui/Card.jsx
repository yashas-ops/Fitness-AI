import { memo } from 'react';

function Card({
  children, 
  className = '', 
  variant = 'default', 
  interactive = false,
  as: Component = 'div',
  ...props 
}) {
  const baseClass = {
    default: 'card',
    premium: 'card-premium',
    glow: 'card-glow',
    flat: 'card-flat',
    glass: 'card-glass',
    '3d': 'card-3d card-premium'
  }[variant] || 'card';

  const interactionClass = interactive ? 'card-interactive' : '';

  return (
    <Component
      className={`${baseClass} ${interactionClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default memo(Card);
