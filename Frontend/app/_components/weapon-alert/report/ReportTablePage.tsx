'use client';

import React, { useState, useEffect } from 'react';
import {
  AllWeaponAlertHandlingResponse,
  FlightQueryParams,
  WeaponHandlingResponse,
} from '../types';

import { ReportDataTable } from './DataTable';
import { weaponHandlingReportColumns } from './TableColumn';
import { fetchAllWeaponAlert } from '@/app/_lib/data/weapon-alert';
import ReportTableFilterInputs from './ReportTableFilterInputs';
import { PageSizeDropdown } from '../../common/PageSizeDropdown';
import { PaginationControls } from '../../common/PaginationControls';
import { Input } from '@/components/ui/input';

export default function WeaponHandlingReportTable() {
  // Flight Query State
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [queryParams, setQueryParams] = useState<FlightQueryParams>({
    departureDateTime: null,
    flightNumber: '',
    departureStation: '',
    arrivalStation: '',
    assignedStatus: null,
    handleStatus: null,
    airCraftRegistration: null,
    tagNumber: null,
    isSent: true,
    pageSize: 10,
    pageNumber: 1,
  });

  const [weaponHandlingData, setWeaponHandlingData] = useState<
    WeaponHandlingResponse[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [showSpinner, setShowSpinner] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const spinnerTimeout = setTimeout(() => setShowSpinner(true), 1000);

      try {
        const result: AllWeaponAlertHandlingResponse =
          await fetchAllWeaponAlert(queryParams);

        setWeaponHandlingData(result.weaponAlertHandling);
        setTotalCount(result.totalCount);
      } catch (err) {
        setIsError(true);
      } finally {
        clearTimeout(spinnerTimeout);
        setLoading(false);
        setShowSpinner(false);
      }
    };

    fetchData();
  }, [queryParams]);

  const handleFilterChange = (filter: Partial<FlightQueryParams>) => {
    setQueryParams(prev => ({
      ...prev,
      ...filter,
      pageNumber: 1,
    }));
  };

  const handleDateChange = (date: string | null) => {
    const parsedDate = date ? new Date(date) : null;
    setSelectedDate(parsedDate);
    handleFilterChange({ departureDateTime: parsedDate });
  };

  useEffect(() => {
    setTotalPages(Math.ceil(totalCount / queryParams.pageSize));
  }, [totalCount, queryParams.pageSize]);

  return (
    <div className="mx-4 mb-4">
      <div className="mt-4 flex gap-3 justify-end items-center">
        <label
          htmlFor="date-picker"
          className="me-3 block text-sm font-semibold text-gray-700"
        >
          Departure Date:
        </label>
        <div className="flex justify-end items-center">
          <Input
            type="date"
            value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
            onChange={e => handleDateChange(e.target.value)}
            placeholder="Select a start date"
            className="p-2 text-sm border border-green-600-radius-md outline-none"
          />
        </div>
      </div>
      <ReportTableFilterInputs
        queryParams={queryParams}
        handleFilterChange={handleFilterChange}
      />

      <ReportDataTable
        columns={weaponHandlingReportColumns()}
        data={weaponHandlingData}
        tableName="Weapon Alert Handling Report"
        loading={showSpinner || loading}
        isError={isError}
      />

      <div className="flex justify-between items-baseline mt-4">
        <PaginationControls
          page={queryParams.pageNumber}
          totalPages={totalPages}
          onPageChange={newPage =>
            setQueryParams(prev => ({
              ...prev,
              pageNumber: newPage,
            }))
          }
        />

        <PageSizeDropdown
          currentSize={queryParams.pageSize}
          onChange={newSize =>
            setQueryParams(prev => ({
              ...prev,
              pageSize: newSize,
              pageNumber: 1,
            }))
          }
        />
      </div>
    </div>
  );
}
