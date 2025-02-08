'use client';

import React, { useState, useEffect } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { FlightDataTable } from './FlightDataTable';
import { flightDataColumns } from './TableColumns';
import { SearchFlight } from '@/app/_lib/data/flight_schedule';
import { FlightDataSearch, FlightScheduleDetailDto } from '../../common/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import WeaponAlertTableRowActions from '../actions/WeaponAlertTableRowActions';
import NotFoundMessage from '../../common/NotFoundMessage';

export default function FlightScheduleList({
  params,
}: {
  params: FlightDataSearch;
}) {
  const [today, setToday] = useState<Date>(new Date());
  const [flights, setFlights] = useState<FlightScheduleDetailDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [totalCount, setTotalCount] = useState(0);

  const [filterParams, setFilterParams] = useState<FlightDataSearch>({
    flightNumber: params.flightNumber || null,
    departure: params.departure || null,
    arrival: params.arrival || null,
    aircraftType: params.aircraftType || null,
    airCraftRegistration: params.airCraftRegistration || null,
    pageSize: params.pageSize || 10,
    pageNumber: params.pageNumber || 1,
    scheduledDepartureTime: params.scheduledDepartureTime || selectedDate,
  });

  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await SearchFlight({
          ...filterParams,
          pageNumber: page,
          pageSize: filterParams.pageSize,
        });

        if (response.isSuccess && response.payload) {
          setFlights(response.payload.flights);
          setTotalCount(response.payload.totalCount);
        } else if (response.errors.length > 0) {
          setError(true);
          setErrorMsg(response.errors[0]);
        }
      } catch (error) {
        setError(true);
        setErrorMsg('Something went wrong, please try again!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterParams, page]);

  const handleFilterChange = (filter: Partial<typeof filterParams>) => {
    setFilterParams(prevParams => ({
      ...prevParams,
      ...filter,
    }));

    setPage(1);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    handleFilterChange({ scheduledDepartureTime: date });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const dateIntervalId = setInterval(() => {
      setToday(new Date());
    }, 60 * 1000);

    return () => clearInterval(dateIntervalId);
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / filterParams.pageSize);

  // if (!loading && errorMsg) {
  //   <div className="h-screen flex justify-center items-center">
  //     <NotFoundMessage message={errorMsg} />
  //   </div>;
  // }

  return (
    <div className="mx-4">
      <div className="flex flex-col gap-4 p-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <span className="text-gray-600">Today:</span>
            <span className="font-semibold text-md text-gray-800">
              {today.toDateString()}
              {', '}
              {today.toLocaleTimeString([], {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
                timeZone: 'utc',
              })}{' '}
              (UTC)
            </span>
          </div>
          <div className="flex justify-end items-center">
            <label
              htmlFor="date-picker"
              className="me-3 block text-sm font-semibold text-gray-700"
            >
              Departure Date:
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              placeholderText="Select a date"
              dateFormat="MMMM d, yyyy"
              showOutsideDays={true}
              className={cn(
                'p-3',
                'text-sm border p-2 rounded-sm outline-none',
                selectedDate ? 'border-green-600-radius-md' : '',
              )}
              components={{
                IconLeft: <ChevronLeftIcon className="h-4 w-4" />,
                IconRight: <ChevronRightIcon className="h-4 w-4" />,
              }}
            />
          </div>
        </div>
        {/* Filtering Inputs */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="flex items-center">
            <span
              style={{
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px',
              }}
              className="text-sm rounded-l-md p-2 bg-green-700 text-white"
            >
              ET
            </span>
            <Input
              type="text"
              placeholder="Flight Number"
              value={filterParams.flightNumber || ''}
              onChange={e =>
                handleFilterChange({ flightNumber: e.target.value })
              }
              className={`${
                filterParams.flightNumber ? 'uppercase border-green-600' : ''
              } rounded-l-none focus:border-green-600 placeholder:text-gray-500`}
            />
          </div>

          <Input
            type="text"
            placeholder="Departure"
            value={filterParams.departure || ''}
            className={`${
              filterParams.departure ? 'uppercase border-green-600' : ''
            } focus:border-green-600 placeholder:text-gray-500`}
            onChange={e => handleFilterChange({ departure: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Arrival"
            value={filterParams.arrival || ''}
            className={`${
              filterParams.arrival ? 'uppercase border-green-600' : ''
            } focus:border-green-600 placeholder:text-gray-500`}
            onChange={e => handleFilterChange({ arrival: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Aircraft Type"
            value={filterParams.aircraftType || ''}
            className={`${
              filterParams.aircraftType ? 'uppercase border-green-600' : ''
            } focus:border-green-600 placeholder:text-gray-500`}
            onChange={e => handleFilterChange({ aircraftType: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Tail"
            value={filterParams.airCraftRegistration || ''}
            onChange={e =>
              handleFilterChange({ airCraftRegistration: e.target.value })
            }
            className={`${
              filterParams.airCraftRegistration
                ? 'uppercase border-green-600'
                : ''
            } focus:border-green-600 placeholder:text-gray-500`}
          />
        </div>
      </div>

      {!error && (
        <FlightDataTable
          columns={flightDataColumns({
            actions: row => <WeaponAlertTableRowActions row={row} />,
          })}
          data={flights}
          loading={loading}
          isError={error}
          tableName="Flight Schedules"
        />
      )}

      <div className="mb-4 flex justify-between items-baseline">
        <Pagination>
          <PaginationContent>
            {page > 1 ? (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(page - 1, 1))}
                />
              </PaginationItem>
            ) : (
              <Button variant={'ghost'} disabled>
                <ChevronLeftIcon className="h-4 w-fit" />
                <span>Previous</span>
              </Button>
            )}

            {totalPages > 0 && (
              <>
                {page > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(1)}>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {page > 4 && <PaginationEllipsis />}
                  </>
                )}

                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                  const pageNumber = page - 2 + index;
                  if (pageNumber > 0 && pageNumber <= totalPages) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNumber)}
                          isActive={pageNumber === page}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                {page < totalPages - 2 && (
                  <>
                    {page < totalPages - 3 && <PaginationEllipsis />}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </>
            )}

            {page < totalPages ? (
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(page + 1, totalPages))
                  }
                />
              </PaginationItem>
            ) : (
              <Button variant={'ghost'} disabled>
                <span>Next</span>
                <ChevronRightIcon className="h-4 w-fit" />
              </Button>
            )}
          </PaginationContent>
        </Pagination>

        {/* Shadcn Dropdown for page size selection */}
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Page Size: {filterParams.pageSize}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuLabel>Select Page Size</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={String(filterParams.pageSize)}
                onValueChange={size => {
                  handleFilterChange({ pageSize: Number(size) });
                  setPage(1);
                }}
              >
                <DropdownMenuRadioItem value="5">5</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="10">10</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="15">15</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="25">25</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
