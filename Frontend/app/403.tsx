import { Lock } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <Lock className="mx-auto text-red-500 w-16 h-16" /> {/* Lock Icon */}
        <h1 className="mt-4 text-4xl font-semibold text-gray-800">
          403 - Unauthorized
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          You do not have permission to access this page.
        </p>
        <div className="mt-4">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
}
