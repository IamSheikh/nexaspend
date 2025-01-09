/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useState, useEffect, useRef } from 'react';
import numeral from 'numeral';
import {
  calculateLuminance,
  formatDate,
  formatDateWithDDMMYYYY,
  getFirstAndLastDayOfLastMonth,
  getFirstAndLastDayOfMonth,
  getRandomColor,
} from '../utils';
import { ICategory, IDaybook } from '../../types';

const SecondaryHeader = ({
  backgroundColor,
  textColor,
  activeTab,
  printingMode,
  toggleSidebar,
  searchData,
  setSearchData,
  setBackgroundColor,
  setTextColor,
  setRefreshState,
  results,
  setResults,
  setCurrentPage,
  refreshState,
}: {
  activeTab: any;
  printingMode: any;
  toggleSidebar: any;
  searchData: any;
  setSearchData: any;
  setBackgroundColor: any;
  setTextColor: any;
  backgroundColor: any;
  textColor: any;
  setRefreshState: any;
  results: any;
  setResults: any;
  setCurrentPage: any;
  refreshState: any;
}) => {
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ICategory[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<ICategory[]>([]);
  const [, setTodayExpenses] = useState<IDaybook[]>([]);
  const [, setPreviousMonthResults] = useState<IDaybook[]>([]);
  const [, setCurrentMonthResults] = useState<IDaybook[]>([]);
  const startDateRef = useRef<any>(null);
  const endDateRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const categories = (await window.electron.getAllCategories(
        // @ts-ignore
        +localStorage.getItem('currentAccountId'),
      )) as ICategory[];
      const filteredExpenseCategories = categories.filter(
        (category) => category.type === 'EXPENSE',
      );
      const filteredIncomeCategories = categories.filter(
        (category) => category.type === 'INCOME',
      );
      setAllCategories(categories);
      setExpenseCategories(filteredExpenseCategories);
      setIncomeCategories(filteredIncomeCategories);

      const { firstDay: previousMonthFirstDay, lastDay: previousMonthLastDay } =
        getFirstAndLastDayOfLastMonth();
      const previous = await window.electron.getDaybookByFilters(
        [previousMonthFirstDay, previousMonthLastDay],
        'ALL',
        'ALL',
        // @ts-ignore
        +localStorage.getItem('currentAccountId'),
      );
      setPreviousMonthResults(previous);

      const { firstDay: monthFirstDay, lastDay: monthLastDay } =
        getFirstAndLastDayOfMonth();
      const current = await window.electron.getDaybookByFilters(
        [monthFirstDay, monthLastDay],
        'ALL',
        'ALL',
        // @ts-ignore
        +localStorage.getItem('currentAccountId'),
      );
      setCurrentMonthResults(current);

      const todayExpense = await window.electron.getDaybookByFilters(
        [formatDate(new Date()), formatDate(new Date())],
        'EXPENSE',
        'ALL',
        // @ts-ignore
        +localStorage.getItem('currentAccountId'),
      );
      setTodayExpenses(todayExpense);
    })();
  }, [refreshState]);

  const handleSearch = async () => {
    const isThereDates = searchData.startDate !== '' && searchData.endDate;
    const filteredResults = await window.electron.getDaybookByFilters(
      isThereDates
        ? [searchData.startDate, searchData.endDate]
        : [
            getFirstAndLastDayOfMonth().firstDay,
            getFirstAndLastDayOfMonth().lastDay,
          ],
      searchData.entryType,
      searchData.categoryId,
      // @ts-ignore
      +localStorage.getItem('currentAccountId'),
    );

    setResults(filteredResults);
    setCurrentPage(1);
  };

  return (
    <div
      className={`px-2 flex z-[45] top-[5.9rem] sticky bg-white justify-between items-center ${activeTab !== 'Transaction' && 'hidden'} ${printingMode && 'hidden'}`}
    >
      {/* Hamburger Menu */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 text-2xl"
        type="button"
      >
        ☰
      </button>

      {/* Date Range Picker & Filters */}
      <div
        className={`flex-grow flex items-center justify-center ${activeTab !== 'Transaction' && 'hidden'} ${printingMode && 'hidden'}`}
      >
        <div className="flex">
          {/* Start Date Picker */}
          <div className="flex items-center">
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-gray-700"
            >
              Start Date:
            </label>
            <input
              id="startDate"
              type="date"
              className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
              ref={startDateRef}
              onClick={() => startDateRef.current?.showPicker()}
              value={searchData.startDate}
              onChange={(e) =>
                setSearchData({ ...searchData, startDate: e.target.value })
              }
            />
          </div>

          {/* End Date Picker */}
          <div className="flex items-center ml-1">
            <label
              htmlFor="endDate"
              className="text-sm font-medium text-gray-700"
            >
              End Date:
            </label>
            <input
              id="endDate"
              type="date"
              className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
              ref={endDateRef}
              onClick={() => endDateRef.current?.showPicker()}
              value={searchData.endDate}
              onChange={(e) =>
                setSearchData({ ...searchData, endDate: e.target.value })
              }
            />
          </div>

          {/* Entry Type Dropdown */}
          <div className="flex items-center ml-1">
            <label
              htmlFor="entryType"
              className="text-sm font-medium text-gray-700"
            >
              Entry Type:
            </label>
            <select
              id="entryType"
              className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
              value={searchData.entryType}
              onChange={(e) =>
                setSearchData({ ...searchData, entryType: e.target.value })
              }
            >
              <option value="ALL">All</option>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center ml-1">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700"
            >
              Category:
            </label>
            <select
              id="category"
              className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2"
              value={searchData.categoryId}
              onChange={(e) => {
                setSearchData({ ...searchData, categoryId: e.target.value });
                const newColor =
                  e.target.value === 'ALL' ? 'white' : getRandomColor();
                setBackgroundColor(newColor);
                setTextColor(calculateLuminance(newColor));
              }}
            >
              <option value="ALL">All</option>
              {searchData.entryType === 'ALL'
                ? allCategories.map((cate) => (
                    <option key={cate.id} value={cate.id}>
                      {cate.name}
                    </option>
                  ))
                : searchData.entryType === 'EXPENSE'
                  ? expenseCategories.map((cate) => (
                      <option key={cate.id} value={cate.id}>
                        {cate.name}
                      </option>
                    ))
                  : incomeCategories.map((cate) => (
                      <option key={cate.id} value={cate.id}>
                        {cate.name}
                      </option>
                    ))}
            </select>
          </div>
        </div>

        {/* Search and Reset Button */}
        <div className="ml-2 flex">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-2"
            onClick={() => {
              setRefreshState((prev: any) => !prev);
              setSearchData({
                startDate: '',
                endDate: '',
                categoryId: 'ALL',
                entryType: 'ALL',
              });
              setBackgroundColor('white');
              setTextColor('black');
            }}
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryHeader;
