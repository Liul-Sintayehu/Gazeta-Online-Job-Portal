// app/404.tsx
import React from 'react';
import Link from 'next/link';

export default function Custom404() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <p className="text-xl mt-4">Page Not Found</p>
            <Link href="/dashboard">
                <a className="mt-6 text-blue-500 underline">Go Back to Dashboard</a>
            </Link>
        </div>
    );
}
