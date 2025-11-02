type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyles = {
    active: 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium',
    draft: 'bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium',
    pending: 'bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium',
    inactive: 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium',
  };

  const statusKey = status.toLowerCase() as keyof typeof statusStyles;
  const className = statusStyles[statusKey] || statusStyles.draft;

  return <span className={className}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};
