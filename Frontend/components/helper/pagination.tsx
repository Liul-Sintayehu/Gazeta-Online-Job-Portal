import { useState, useEffect } from 'react';

// Custom hook to manage both rows per page and current page stored in sessionStorage
export const usePagination = (
  defaultRows: number = 10,
  defaultPage: number = 0,
) => {
  const [rows, setRows] = useState<number>(defaultRows);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);

  useEffect(() => {
    // Load rows per page and current page from sessionStorage on component mount
    const storedRows = sessionStorage.getItem('rowsPerPage');
    const storedPage = sessionStorage.getItem('currentPage');
    if (storedRows) {
      setRows(parseInt(storedRows, 10));
    }
    if (storedPage) {
      setCurrentPage(parseInt(storedPage, 10));
    }
  }, []);

  const updatePagination = (newRows: number, newPage: number) => {
    setRows(newRows); // Update rows state
    setCurrentPage(newPage); // Update current page state
    sessionStorage.setItem('rowsPerPage', newRows.toString()); // Store rows per page
    sessionStorage.setItem('currentPage', newPage.toString()); // Store current page
  };

  const resetPage = () => {
    setCurrentPage(0);
  };

  return { rows, currentPage, updatePagination, resetPage };
};
