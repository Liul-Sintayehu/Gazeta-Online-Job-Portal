import React from 'react';
import { TbFileOff } from 'react-icons/tb';

interface NotFoundMessageProps {
  message?: string;
}

export default function NotFoundMessage({ message }: NotFoundMessageProps) {
  return (
    <div className="flex justify-center items-center flex-col gap-2 my-2 mx-4 p-6 text-gray-400">
      <TbFileOff className="text-[100px]" />
      <span className="text-xl">{message || '404 | Not found!'}</span>
    </div>
  );
}
