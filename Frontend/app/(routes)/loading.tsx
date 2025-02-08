'use client';
import React from 'react';
import Spinner from '../_components/common/Spinner';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  );
};

export default Loading;
