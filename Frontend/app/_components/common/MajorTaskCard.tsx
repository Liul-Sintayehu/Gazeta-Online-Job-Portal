import React from 'react';

interface MajorTaskProps {
  assignedTo: string;
  position: string;
  lastUpdate: string;
}

const MajorTaskCard: React.FC<MajorTaskProps> = ({
  assignedTo,
  position,
  lastUpdate,
}) => {
  return (
    <div
      style={{ borderRadius: '15px' }}
      className="my-2 border rounded-md p-4 shadow-md max-w-full text-gray-700"
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col justify-between gap-2">
          <span className="font-semibold">
            Flight Clearance After Aircraft Search
          </span>
          <span className="text-sm text-gray-500">Pre-flight checklists</span>
        </div>
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex gap-1 flex-col  justify-between">
            <span className="font-medium text-sm text-gray-500">
              Assigned to:
            </span>
            <span>{assignedTo}</span>
          </div>
          <div className="flex gap-1 flex-col  justify-between">
            <span className="font-medium text-sm text-gray-500">Position:</span>
            <span>{position}</span>
          </div>

          <div className="flex gap-1 flex-col  justify-between">
            <span className="font-medium text-sm text-gray-500">
              Last Update:
            </span>
            <span>{lastUpdate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MajorTaskCard;
