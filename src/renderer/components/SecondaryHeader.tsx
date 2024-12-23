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
  const [todayExpenses, setTodayExpenses] = useState<IDaybook[]>([]);
  const [previousMonthResults, setPreviousMonthResults] = useState<IDaybook[]>(
    [],
  );
  const [currentMonthResults, setCurrentMonthResults] = useState<IDaybook[]>(
    [],
  );
  const startDateRef = useRef<any>(null);
  const endDateRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const categories =
        (await window.electron.getAllCategories()) as ICategory[];
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
      );
      setPreviousMonthResults(previous);

      const { firstDay: monthFirstDay, lastDay: monthLastDay } =
        getFirstAndLastDayOfMonth();
      const current = await window.electron.getDaybookByFilters(
        [monthFirstDay, monthLastDay],
        'ALL',
        'ALL',
      );
      setCurrentMonthResults(current);

      const todayExpense = await window.electron.getDaybookByFilters(
        [formatDate(new Date()), formatDate(new Date())],
        'EXPENSE',
        'ALL',
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
    );

    setResults(filteredResults);
    setCurrentPage(1);
  };

  return (
    <div
      className={`px-2 flex z-50 top-[5.4rem] sticky bg-white justify-between ${activeTab !== 'Transaction' && 'hidden'} ${printingMode && 'hidden'}`}
    >
      <button
        onClick={toggleSidebar}
        className="ml-4 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 text-2xl"
        type="button"
      >
        ☰
      </button>

      {/* Date Range Picker & Filters */}
      <div
        className={`flex items-center ${activeTab !== 'Transaction' && 'hidden'} ${printingMode && 'hidden'}`}
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
              onClick={() => {
                if (startDateRef.current) {
                  startDateRef.current.showPicker();
                }
              }}
              value={searchData.startDate}
              onChange={(e) => {
                const clone = { ...searchData };
                clone.startDate = e.target.value;
                setSearchData(clone);
              }}
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
              onClick={() => {
                if (endDateRef.current) {
                  endDateRef.current.showPicker();
                }
              }}
              value={searchData.endDate}
              onChange={(e) => {
                const clone = { ...searchData };
                clone.endDate = e.target.value;
                setSearchData(clone);
              }}
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
              onChange={(e) => {
                const clone = { ...searchData };
                clone.entryType = e.target.value;
                setSearchData(clone);
              }}
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
              className={`border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-2 ${searchData.categoryId !== 'ALL' && 'focus:ring-0'}`}
              style={{ backgroundColor, color: textColor }}
              value={searchData.categoryId}
              onChange={(e) => {
                const clone = { ...searchData };
                clone.categoryId = e.target.value;
                setSearchData(clone);
                if (e.target.value === 'ALL') {
                  setBackgroundColor('white');
                  setTextColor('black');
                } else {
                  const newColor = getRandomColor();
                  setBackgroundColor(newColor);
                  setTextColor(calculateLuminance(newColor));
                }
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
        <div className="ml-2">
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
            }}
          >
            X
          </button>
        </div>
      </div>

      {/* Transaction Summary Section */}
      <div className="flex flex-col ml-22">
        {/* Previous Month */}
        <div className="flex mb-1">
          <h2 className="text-sm font-semibold text-red-500 w-[190px]">
            {new Date(
              new Date().setMonth(new Date().getMonth() - 1),
            ).toLocaleString('default', { month: 'long' })}
            , {new Date().getFullYear()}:
          </h2>
          <p className="ml-5 text-left w-[100px]">
            {numeral(
              previousMonthResults
                .filter((da) => da.type === 'EXPENSE')
                .reduce((total: number, item: any) => total + item.amount, 0),
            ).format('0,0')}
          </p>
        </div>

        {/* Current Month */}
        <div className="flex mb-1">
          <h2 className="text-sm font-semibold text-blue-800 w-[190px]">
            {new Date().toLocaleDateString('default', { month: 'long' })},{' '}
            {new Date().getFullYear()}:
          </h2>
          <p className="ml-5 text-left w-[100px]">
            {numeral(
              currentMonthResults
                .filter((da: any) => da.type === 'EXPENSE')
                .reduce((total: number, item: any) => total + item.amount, 0),
            ).format('0,0')}
          </p>
        </div>

        {/* Today */}
        {searchData.startDate === '' || searchData.endDate === '' ? (
          <div className="flex">
            <h2 className="text-sm font-semibold text-blue-800 w-[190px]">
              Today:{' '}
            </h2>
            <p className="ml-5 text-left w-[100px]">
              {numeral(
                todayExpenses
                  .filter((da: any) => da.date === formatDate(new Date()))
                  .reduce((total: number, item: any) => total + item.amount, 0),
              ).format('0,0')}
            </p>
          </div>
        ) : (
          ''
        )}

        {/* Custom Date Range */}
        {searchData.startDate !== '' && searchData.endDate !== '' && (
          <div className="flex">
            <h2 className="text-sm font-semibold text-blue-800 w-[190px]">
              {searchData.startDate} to {searchData.endDate}:
            </h2>
            <p className="ml-5 text-left w-[100px]">
              {numeral(
                results
                  .filter((da: any) => da.type === 'EXPENSE')
                  .reduce((total: number, item: any) => total + item.amount, 0),
              ).format('0,0')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondaryHeader;
