import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ParentNavProps {
  label: string;
  icon: React.ElementType;
  // isSidebarOpen: boolean;
  isDropdownOpen: boolean;
  children: React.ReactNode;
}

const ParentNav: React.FC<ParentNavProps> = ({
  label,
  icon: Icon,
  // isSidebarOpen,
  isDropdownOpen,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(isDropdownOpen);
  }, [isDropdownOpen]);

  return (
    <div className="mb-2">
      <button
        className="w-full text-left flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <Icon size={24} />

        <div className="w-full flex items-center justify-between">
          <span className="ml-2 text-sm">{label}</span>
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>
      {isOpen && <div className="pl-4 mt-2 space-y-1">{children}</div>}
    </div>
  );
};

export default ParentNav;
