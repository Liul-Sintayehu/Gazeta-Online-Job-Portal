import React from 'react';
import { FlightScheduleDetailDto } from '../clearance/types';

const FlightSchedule = ({
  flightSchedule,
}: {
  flightSchedule: FlightScheduleDetailDto;
}) => {
  return (
    <div
      style={{ borderRadius: '15px' }}
      className="my-2 border rounded-lg shadow-md p-4 max-w-full text-gray-700 font-inter"
    >
      <h2 className="text-md font-semibold mb-4 pb-2 border-b-1">
        Flight Schedule Information
      </h2>
      {!flightSchedule.flightNumber ? (
        <h4 className="text-center">No Flight Information Found!</h4>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-start">
          <div className="flex gap-1 flex-col  justify-between">
            <span className="font-medium text-sm text-gray-500">
              Flight Number
            </span>
            <span>
              {`${flightSchedule.carrier}-${flightSchedule.flightNumber} ${
                flightSchedule.suffix ? flightSchedule : ''
              }`}
            </span>
          </div>
          <div className="flex gap-1 flex-col  justify-between">
            <span className="font-medium text-sm text-gray-500">
              Aircraft Type
            </span>
            <span>{flightSchedule.aircraftType}</span>
          </div>
          <div className="flex gap-1 flex-col  justify-between">
            <span className="font-medium text-sm text-gray-500">
              Tail (Previous)
            </span>
            <span
              className={`${
                flightSchedule.previousTail &&
                'animate-blinkColor font-semibold'
              }`}
            >
              {flightSchedule.aircraftRegistration}{' '}
              {flightSchedule.previousTail &&
                `(${flightSchedule.previousTail})`}
            </span>
          </div>
          <div className="flex gap-1 flex-col  justify-between">
            <span className="font-medium text-sm text-gray-500">
              Departure Station
            </span>
            <span>{flightSchedule.latestDeparture}</span>
          </div>
          <div className="flex gap-1 flex-col  justify-between">
            <span className="font-medium text-sm text-gray-500">
              Departure Date & Time
            </span>
            <span>
              {new Date(flightSchedule.scheduledDepartureTime).toLocaleString()}
            </span>
          </div>
          <div className="flex gap-1 flex-col  justify-between">
            <span className="font-medium text-sm text-gray-500">
              Departure Parking Stand
            </span>
            <span>{flightSchedule.departureParkingStand}</span>
          </div>
          <div className="flex gap-1 flex-col  justify-between">
            <span className="font-medium text-sm text-gray-500">
              Arrival Station
            </span>
            <span>{flightSchedule.latestArrival}</span>
          </div>
          <div className="flex gap-1 flex-col  justify-between">
            <span className="font-medium text-sm text-gray-500">
              Arrival Date & Time
            </span>
            <span>
              {new Date(flightSchedule.scheduledArrivalTime).toLocaleString()}
            </span>
          </div>
          <div className="flex gap-1 flex-col  justify-between">
            <span className="font-medium text-sm text-gray-500">
              Arrival Parking Stand
            </span>
            <span>{flightSchedule.arrivalParkingStand}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSchedule;
