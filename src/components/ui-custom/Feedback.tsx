type AlertType = 'success' | 'warning' | 'error' | 'info';

export const FeedbackAlert = ({ type, title, message }: { type: AlertType; title?: string; message: string }) => {
  const bg = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900 dark:text-yellow-400',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900 dark:text-red-400',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900 dark:text-blue-400'
  };

  return (
    <div className={`flex items-start p-4 border rounded-md ${bg[type]} mb-4`} role="alert">
      <div className="ml-2">
        {title && <h3 className="text-sm font-semibold mb-1">{title}</h3>}
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
};

export const SkeletonLine = ({ className = "h-4 w-full" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className}`} />
);

export const SkeletonCard = () => (
  <div className="border rounded-md p-4 space-y-3 bg-card">
    <SkeletonLine className="h-5 w-1/3" />
    <SkeletonLine className="h-4 w-full" />
    <SkeletonLine className="h-4 w-5/6" />
  </div>
);
