'use client';
import React, { ReactNode, useState } from 'react';

type TooltipProps = {
  content: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
};

const positionClasses = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
};

const sizeClasses = {
  sm: 'w-24', // Small width (e.g., 96px)
  md: 'w-48', // Medium width (e.g., 192px)
  lg: 'w-64', // Large width (e.g., 256px)
  xl: 'w-80',
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  size = 'md',
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div
          style={{
            backgroundColor: '#00000080',
          }}
          className={`absolute ${positionClasses[position]} ${sizeClasses[size]}
                  text-white text-center text-sm p-2 rounded shadow-lg z-10`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
