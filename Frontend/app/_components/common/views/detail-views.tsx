import { cn } from '@nextui-org/react';

const DetailCard = ({
  title,
  actions,
  children,
  className,
}: {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn('space-y-4 p-4 bg-white shadow rounded-xl border', className)}
  >
    <div className="flex justify-between items-center">
      {title && (
        <h3 className="text-gray-800 text-lg font-semibold">{title}</h3>
      )}
      {actions && <div className="flex justify-end gap-4">{actions}</div>}
    </div>
    <div>{children}</div>
  </div>
);

const DetailSection = ({
  title,
  children,
  className,
  display = 'grid',
}: {
  title: string;
  children: React.ReactNode;
  className?: string | undefined;
  display?: 'grid' | 'flex';
}) => {
  return (
    <div className={cn('border-t pb-4 px-2', className)}>
      <h3 className="text-gray-700 px-0 my-4">{title}</h3>
      <div
        className={cn(
          display === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 gap-3'
            : 'flex flex-wrap gap-5',
          'items-start',
        )}
      >
        {children}
      </div>
    </div>
  );
};

const DetailField = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | JSX.Element;
  className?: string | undefined;
}) => (
  <div className={cn('flex gap-1 flex-col justify-between', className)}>
    <span className="text-sm font-semibold text-gray-500">{label}</span>
    <span>{value}</span>
  </div>
);

export { DetailCard, DetailSection, DetailField };
