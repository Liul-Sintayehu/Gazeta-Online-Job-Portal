import { CircleAlert } from 'lucide-react';

export default function ErrorMessage({ error }: { error: string }) {
  return (
    <div
      className="flex items-center justify-center w-full p-4 mb-4 gap-2 font-semibold text-red-500 rounded-xl bg-red-50 dark:bg-gray-800 dark:text-red-400"
      role="alert"
    >
      <CircleAlert className="h-5 w-5" />
      <span className="sr-only">Error</span>
      <div>{error}</div>
    </div>
  );
}
