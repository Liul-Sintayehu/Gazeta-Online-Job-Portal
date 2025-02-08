import Link from 'next/link';

export const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string;
  icon: React.ElementType;
  label?: string;
  isActive: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 transition-colors duration-200 ${
        isActive ? 'bg-green-800 text-white' : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      <Icon size={20} />
      {label && <span className={`ml-2 text-sm`}>{label}</span>}
    </Link>
  );
};
