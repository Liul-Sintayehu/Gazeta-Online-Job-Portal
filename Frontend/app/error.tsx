'use client';
import React from 'react';
import { OutlineButton } from './_components/ui/Button';

export default function Error({
    error,
    reset,
  }: {
    error: Error & { digest?: string }
    reset: () => void
  }){

    return (
    <div className="min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="bg-gradient-to-br from-red-400 to-yellow-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
            500
          </p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h4 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                Internal error
              </h4>
              <p className="mt-1 text-base text-red-500">
              {error.message}
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
            <OutlineButton className="p-button-rounded p-button-danger" onClick={() => reset()} >Retry</OutlineButton>
            </div>
          </div>
        </main>
      </div>
    </div>
    );
}
