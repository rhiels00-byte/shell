import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hoverable = false,
  onClick
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl p-5
        shadow-sm shadow-gray-900/5
        transition-all duration-200
        ${hoverable ? 'hover:-translate-y-1 hover:shadow-md hover:shadow-gray-900/10 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
