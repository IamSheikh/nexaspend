/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import numeral from 'numeral';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ICategory, IDaybook, ITransactionAccount } from '../../types';
import colors from '../utils/100000_colors';
import hover_colors from '../utils/100000_hover_colors';
import {
  formatDate,
  formatDateWithDDMMYYYY,
  getFirstAndLastDayOfLastMonth,
  getFirstAndLastDayOfMonth,
} from '../utils';
import { calculateLuminance, getRandomColor } from '../utils/colors';
import getFirstAndLastDayOfMonthFromDate from '../utils/getFirstAndLastDayOfMonthFromDate';

ChartJS.register(ArcElement, Tooltip, Legend);

const Charts = ({
  searchData,
  currentAccountId,
  refreshState,
  setSearchData,
  setResults,
  setBackgroundColor,
  setTextColor,
  setIsTableFooterShowing,
  results,
  currentDate1,
  currentDate2,
  setCurrentDate1,
  setCurrentDate2,
}: {
  searchData: any;
  currentAccountId: number;
  refreshState: any;
  setSearchData: any;
  setResults: any;
  setBackgroundColor: any;
  setTextColor: any;
  setIsTableFooterShowing: any;
  results: any;
  currentDate1: any;
  currentDate2: any;
  setCurrentDate1: any;
  setCurrentDate2: any;
}) => {
  const [expenseChartData, setExpenseChartData] = useState<any>(null);
  const [incomeChartData, setIncomeChartData] = useState<any>(null);

  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    setExpenseChartData(null);
    setIncomeChartData(null);
  }, [currentAccountId]);

  const [helpMe, setHelpMe] = useState<any>();
  const [helpMePlz, setHelpMePlz] = useState<any>();
  const [handleExpenseClick, setHandleExpenseClick] = useState<any>();
  const [handleIncomeClick, setHandleIncomeClick] = useState<any>();
  const [
    doesExpenseMonthHaveTransactions,
    setDoesExpenseMonthHaveTransactions,
  ] = useState(true);
  const [doesIncomeMonthHaveTransactions, setDoesIncomeMonthHaveTransactions] =
    useState(true);
  const [previousMonthResults, setPreviousMonthResults] = useState<IDaybook[]>(
    [],
  );
  const [currentMonthResults, setCurrentMonthResults] = useState<IDaybook[]>(
    [],
  );
  const [todayExpenses, setTodayExpenses] = useState<IDaybook[]>([]);

  const [todayIncome, setTodayIncome] = useState<IDaybook[]>([]);

  const [allCategory, setAllCategory] = useState<ICategory[]>([]);
  const [, setThisMonthIncome] = useState(0);
  const [accounts, setAccounts] = useState<ITransactionAccount[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories for current account
      const allCategories = (await window.electron.getAllCategories(
        currentAccountId,
      )) as ICategory[];

      // Filter expense categories (assuming type === 'EXPENSE' is valid)
      const expenseCategories = allCategories.filter(
        (category) => category.type === 'EXPENSE',
      );

      // Check if there are no expense categories
      if (!expenseCategories || expenseCategories.length === 0) {
        return;
      }

      // Fetch all transactions for the current account
      const allTransactions = (await window.electron.getDaybookByFilters(
        [
          getFirstAndLastDayOfMonthFromDate(currentDate1.toString()).firstDay,
          getFirstAndLastDayOfMonthFromDate(currentDate1.toString()).lastDay,
        ],
        'ALL',
        'ALL',
        currentAccountId,
      )) as IDaybook[];

      // Filter transactions for expense type only
      const expenseTransactions = allTransactions.filter(
        (transaction) => transaction.type === 'EXPENSE',
      );

      // Check if there are no expense transactions
      if (!expenseTransactions || expenseTransactions.length === 0) {
        // setExpenseChartData(null);
        setDoesExpenseMonthHaveTransactions(false);
        return;
      }
      setDoesExpenseMonthHaveTransactions(true);

      // Step 1: Aggregate the data by categoryId (sum up amounts for the same category)
      const aggregatedData = expenseTransactions.reduce(
        (acc, { categoryId, amount }) => {
          if (acc[categoryId]) {
            acc[categoryId] += amount; // Sum the amounts for the same category
          } else {
            acc[categoryId] = amount; // Initialize with the first amount for the category
          }
          return acc;
        },
        {} as Record<number, number>,
      );

      // Step 2: Prepare the chart data
      const labels = Object.keys(aggregatedData).map((categoryId) => {
        // Find category name by categoryId
        const category = expenseCategories.find(
          (categor) => categor.id === Number(categoryId),
        );
        return category ? category.name : 'Unknown';
      });

      // Step 3: Prepare the data as percentages
      const total = Object.values(aggregatedData).reduce(
        (sum, value) => sum + value,
        0,
      );
      const data = Object.values(aggregatedData).map((amount) =>
        ((amount / total) * 100).toFixed(2),
      );

      // Step 4: Generate random colors for each category
      const result = data.map(() => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return {
          backgroundColor: colors[randomIndex],
          hoverColor: hover_colors[randomIndex],
        };
      });

      let selectedCategoryId: number = 0;

      setHelpMe(() => (tooltipItem: any) => {
        const categoryName = tooltipItem.label;
        const rawPercentage = parseFloat(tooltipItem.raw); // Get raw percentage as a float
        const percentage =
          rawPercentage < 0.01
            ? rawPercentage.toFixed(6)
            : rawPercentage.toFixed(2); // Use 6 decimal places for small percentages
        const categoryId = expenseCategories.find(
          (category) => category.name === categoryName,
        )?.id;
        const totalAmount = categoryId ? aggregatedData[categoryId] : 0;
        if (categoryId) {
          selectedCategoryId = categoryId;
        }

        return `${percentage}% (${numeral(totalAmount).format('0,0')})`;
      });

      setHandleExpenseClick(() => async (event: any) => {
        const { chart } = event;
        const activePoints = chart.getElementsAtEventForMode(
          event.native,
          'nearest',
          { intersect: true },
          false,
        );

        if (activePoints.length > 0) {
          const randomColor = getRandomColor();
          const isThereDates =
            searchData.startDate !== '' && searchData.endDate !== '';
          const filteredResults = await window.electron.getDaybookByFilters(
            isThereDates
              ? [searchData.startDate, searchData.endDate]
              : [
                  getFirstAndLastDayOfMonth().firstDay,
                  getFirstAndLastDayOfMonth().lastDay,
                ],
            'ALL',
            `${selectedCategoryId}`,
            // @ts-ignore
            +localStorage.getItem('currentAccountId'),
          );
          setResults(filteredResults);
          setSearchData({ ...searchData, categoryId: selectedCategoryId });
          setBackgroundColor(randomColor);
          setTextColor(calculateLuminance(randomColor));
          // You can use the categoryId for further processing or navigation
        }
      });

      // Step 5: Update chart data
      setExpenseChartData({
        labels,
        datasets: [
          {
            data,
            backgroundColor: result.map((item) => item.backgroundColor),
            hoverBackgroundColor: result.map((item) => item.hoverColor),
          },
        ],
      });
    };

    fetchData();
  }, [refreshState, currentDate1, searchData]);

  useEffect(() => {
    const fetchData = async () => {
      const allCategories = (await window.electron.getAllCategories(
        currentAccountId,
      )) as ICategory[];

      // Filter income categories (assuming type === 'INCOME' is valid)
      const expenseCategories = allCategories.filter(
        (category) => category.type === 'INCOME',
      );

      // Check if there are no categories or empty data
      if (!expenseCategories || expenseCategories.length === 0) {
        // console.log('No income categories available.');
        return;
      }

      // Fetch all transactions for the current account
      const allTransactions = (await window.electron.getDaybookByFilters(
        [
          getFirstAndLastDayOfMonthFromDate(currentDate2.toString()).firstDay,
          getFirstAndLastDayOfMonthFromDate(currentDate2.toString()).lastDay,
        ],
        'ALL',
        'ALL',
        currentAccountId,
      )) as IDaybook[];

      // Filter transactions for income type only
      const incomeTransactions = allTransactions.filter(
        (transaction) => transaction.type === 'INCOME',
      );

      // Check if there are no transactions
      if (!incomeTransactions || incomeTransactions.length === 0) {
        setDoesIncomeMonthHaveTransactions(false);
        return;
      }
      setDoesIncomeMonthHaveTransactions(true);

      // Step 1: Aggregate the data by categoryId (sum up amounts for the same category)
      const aggregatedData = incomeTransactions.reduce(
        (acc, { categoryId, amount }) => {
          if (acc[categoryId]) {
            acc[categoryId] += amount; // Sum the amounts for the same category
          } else {
            acc[categoryId] = amount; // Initialize with the first amount for the category
          }
          return acc;
        },
        {} as Record<number, number>,
      );

      // Step 2: Prepare the chart data
      const labels = Object.keys(aggregatedData).map((categoryId) => {
        // Find category name by categoryId
        const category = expenseCategories.find(
          (categor) => categor.id === Number(categoryId),
        );
        return category ? category.name : 'Unknown';
      });

      // Step 3: Prepare the data as percentages
      const total = Object.values(aggregatedData).reduce(
        (sum, value) => sum + value,
        0,
      );
      const data = Object.values(aggregatedData).map((amount) =>
        ((amount / total) * 100).toFixed(2),
      );

      // Step 4: Generate random colors for each category
      const result = data.map(() => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return {
          backgroundColor: colors[randomIndex],
          hoverColor: hover_colors[randomIndex],
        };
      });

      setHelpMePlz(() => (tooltipItem: any) => {
        const categoryName = tooltipItem.label;
        const rawPercentage = parseFloat(tooltipItem.raw);
        const percentage =
          rawPercentage < 0.01
            ? rawPercentage.toFixed(6)
            : rawPercentage.toFixed(2);
        const categoryId = expenseCategories.find(
          (category) => category.name === categoryName,
        )?.id;
        const totalAmount = categoryId ? aggregatedData[categoryId] : 0;
        return `${percentage}% (${numeral(totalAmount).format('0,0')})`;
      });

      setHandleIncomeClick(() => async (event: any) => {
        const { chart } = event;
        const activePoints = chart.getElementsAtEventForMode(
          event.native,
          'nearest',
          { intersect: true },
          false,
        );

        if (activePoints.length > 0) {
          const firstPoint = activePoints[0];
          const categoryId = expenseCategories[firstPoint.index].id;

          const randomColor = getRandomColor();
          const isThereDates =
            searchData.startDate !== '' && searchData.endDate;
          const filteredResults = await window.electron.getDaybookByFilters(
            isThereDates
              ? [searchData.startDate, searchData.endDate]
              : [
                  getFirstAndLastDayOfMonth().firstDay,
                  getFirstAndLastDayOfMonth().lastDay,
                ],
            searchData.entryType,
            `${categoryId}`,
            // @ts-ignore
            +localStorage.getItem('currentAccountId'),
          );
          setResults(filteredResults);
          setSearchData({ ...searchData, categoryId });
          setBackgroundColor(randomColor);
          setTextColor(calculateLuminance(randomColor));
          // You can use the categoryId for further processing or navigation
        }
      });

      // Step 5: Update chart data
      setIncomeChartData({
        labels,
        datasets: [
          {
            label: '',
            data,
            backgroundColor: result.map((item) => item.backgroundColor),
            hoverBackgroundColor: result.map((item) => item.hoverColor),
          },
        ],
      });
    };

    fetchData();
  }, [refreshState, currentDate2, searchData]);

  useEffect(() => {
    (async () => {
      const allTransactions = (await window.electron.getDaybookByFilters(
        [
          getFirstAndLastDayOfMonthFromDate(currentDate1.toString()).firstDay,
          getFirstAndLastDayOfMonthFromDate(currentDate1.toString()).lastDay,
        ],
        'ALL',
        'ALL',
        currentAccountId,
      )) as IDaybook[];
      const allExpenses = allTransactions.filter(
        (transaction) => transaction.type === 'EXPENSE',
      );

      const expensesTotal = allExpenses.reduce(
        (total: number, item: any) => total + item.amount,
        0,
      );

      setTotalExpense(expensesTotal);
    })();
  }, [refreshState, currentDate1]);

  useEffect(() => {
    (async () => {
      const allTransactions = (await window.electron.getDaybookByFilters(
        [
          getFirstAndLastDayOfMonthFromDate(currentDate2.toString()).firstDay,
          getFirstAndLastDayOfMonthFromDate(currentDate2.toString()).lastDay,
        ],
        'ALL',
        'ALL',
        currentAccountId,
      )) as IDaybook[];
      const allIncome = allTransactions.filter(
        (transaction) => transaction.type === 'INCOME',
      );

      const incomeTotal = allIncome.reduce(
        (total: number, item: any) => total + item.amount,
        0,
      );

      setTotalIncome(incomeTotal);
    })();
  }, [refreshState, currentDate2]);

  useEffect(() => {
    (async () => {
      const categories = (await window.electron.getAllCategories(
        // @ts-ignore
        +localStorage.getItem('currentAccountId'),
      )) as ICategory[];
      setAllCategory(categories);
      // setExpenseCategories(filteredExpenseCategories);
      // setIncomeCategories(filteredIncomeCategories);

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

      const allAccounts = await window.electron.getAllTransactionAccounts(
        // @ts-ignore
        +localStorage.getItem('currentAccountId'),
      );
      setAccounts(allAccounts);
    })();
  }, [refreshState]);

  useEffect(() => {
    (async () => {
      const categories = (await window.electron.getAllCategories(
        // @ts-ignore
        +localStorage.getItem('currentAccountId'),
      )) as ICategory[];
      setAllCategory(categories);

      const income = await window.electron.getDaybookByFilters(
        [formatDate(new Date()), formatDate(new Date())],
        'INCOME',
        'ALL',
        // @ts-ignore
        +localStorage.getItem('currentAccountId'),
      );
      setTodayIncome(income);
    })();
  }, [refreshState]);

  if (!expenseChartData) {
    // return (
    //   <div className="flex justify-center items-center space-x-4 p-4 bg-gray-100">
    //     <h1>There is no expense</h1>
    //   </div>
    // ); // Show loading state while the data is being fetched
    // return;
  }

  const handleNextMonth = () => {
    setCurrentDate1(
      (prevDate: any) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
    );
  };

  const handlePreviousMonth = () => {
    setCurrentDate1(
      (prevDate: any) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
    );
  };

  const handleIncomeNextMonth = () => {
    setCurrentDate2(
      (prevDate: any) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
    );
  };

  const handleIncomePreviousMonth = () => {
    setCurrentDate2(
      (prevDate: any) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
    );
  };

  function getRandomDarkColor() {
    // Generate random RGB values with a bias towards darker shades
    const r = Math.floor(Math.random() * 100);
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);

    // Convert RGB to hex
    const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return color;
  }

  const handleMoreDetails = async () => {
    const { firstDay, lastDay } = getFirstAndLastDayOfMonthFromDate(
      currentDate1.toString(),
    );
    const allTransactions = (await window.electron.getDaybookByFilters(
      [firstDay, lastDay],
      'ALL',
      'ALL',
      currentAccountId,
    )) as IDaybook[];
    const allExpenses = allTransactions.filter(
      (transaction) => transaction.type === 'EXPENSE',
    );

    setResults(allExpenses);
    setSearchData({
      ...searchData,
      startDate: firstDay,
      endDate: lastDay,
      entryType: 'EXPENSE',
    });
    setIsTableFooterShowing(true);
  };

  const handleIncomeMoreDetails = async () => {
    const { firstDay, lastDay } = getFirstAndLastDayOfMonthFromDate(
      currentDate2.toString(),
    );
    const allTransactions = (await window.electron.getDaybookByFilters(
      [firstDay, lastDay],
      'ALL',
      'ALL',
      currentAccountId,
    )) as IDaybook[];
    const allIncome = allTransactions.filter(
      (transaction) => transaction.type === 'INCOME',
    );

    setResults(allIncome);
    setSearchData({
      ...searchData,
      startDate: firstDay,
      endDate: lastDay,
      entryType: 'INCOME',
    });

    setIsTableFooterShowing(true);
  };

  useEffect(() => {
    setThisMonthIncome(
      currentMonthResults
        .filter((da: any) => da.type === 'INCOME')
        .reduce((total: number, item: any) => total + item.amount, 0) -
        currentMonthResults
          .filter((da: any) => da.type === 'EXPENSE')
          .reduce((total: number, item: any) => total + item.amount, 0),
    );
  }, [currentMonthResults]);

  return (
    <div className="flex justify-center items-center space-x-2 p-4 bg-gray-100">
      {/* <div className="w-72 min-h-72 bg-white rounded-lg shadow-md flex-col flex items-center justify-center p-4"> */}
      <div className="w-80 min-h-96 h-[26rem] bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-4">
        {/* Month Navigator */}
        <div className="relative flex justify-between items-center w-full py-2 px-4 rounded-md mt-1">
          <button
            className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded transition"
            type="button"
            onClick={handlePreviousMonth}
          >
            &#8592; Prev
          </button>
          <div className="text-center flex self-center justify-self-center text-lg font-medium z-30">
            {currentDate1.toLocaleDateString('default', { month: 'short' })},{' '}
            {currentDate1.getFullYear()}
          </div>
          <button
            className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded transition"
            type="button"
            onClick={handleNextMonth}
          >
            Next &#8594;
          </button>
        </div>

        {/* Doughnut Chart */}
        <div className="w-full flex-grow">
          {doesExpenseMonthHaveTransactions ? (
            <Doughnut
              data={
                !expenseChartData
                  ? {
                      labels: [],
                      datasets: [
                        {
                          data: [1, 1, 1, 1], // Placeholder values for empty chart
                          backgroundColor: [
                            '#E0E0E0',
                            '#C0C0C0',
                            '#B0B0B0',
                            '#A0A0A0',
                          ],
                          hoverBackgroundColor: [
                            '#E0E0E0',
                            '#C0C0C0',
                            '#B0B0B0',
                            '#A0A0A0',
                          ],
                        },
                      ],
                    }
                  : expenseChartData
              }
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      label: helpMe, // Custom tooltip formatting function
                    },
                  },
                },
                onClick: handleExpenseClick, // Click event handler for the chart
              }}
            />
          ) : (
            <Doughnut
              data={{
                labels: [],
                datasets: [
                  {
                    data: [1, 1, 1, 1], // Placeholder values for empty chart
                    backgroundColor: [
                      '#E0E0E0',
                      '#C0C0C0',
                      '#B0B0B0',
                      '#A0A0A0',
                    ],
                    hoverBackgroundColor: [
                      '#E0E0E0',
                      '#C0C0C0',
                      '#B0B0B0',
                      '#A0A0A0',
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      label: helpMe, // Custom tooltip formatting function
                    },
                  },
                },
                onClick: handleExpenseClick, // Click event handler for the chart
              }}
            />
          )}
        </div>

        {/* Total Expenses */}
        {doesExpenseMonthHaveTransactions && (
          <>
            <h1 className="mt-4 text-gray-800 text-center">
              Total Expenses:{' '}
              <span className="font-semibold text-gray-900">
                {numeral(totalExpense).format('0,0')}
              </span>
            </h1>
            <button
              type="button"
              style={{
                color: getRandomDarkColor(),
              }}
              className="font-medium"
              onClick={handleMoreDetails}
            >
              More Details
            </button>
          </>
        )}
      </div>
      <div className="w-80 min-h-96 h-[26rem] bg-white rounded-lg shadow-md flex flex-col p-4 items-center">
        <div className="flex flex-col items-center self-center w-full">
          <h1 className="text-2xl font-semibold text-center">Expense</h1>
          {/* Previous Month */}
          <div className="flex self-center w-full justify-center mt-2">
            <h2 className="text-sm font-semibold text-red-500 w-[200px]">
              {new Date(
                new Date().setMonth(new Date().getMonth() - 1),
              ).toLocaleString('default', { month: 'long' })}
              ,{' '}
              {new Date(
                new Date().setMonth(new Date().getMonth() - 1),
              ).toLocaleString('default', { month: 'long' }) === 'December'
                ? new Date().getFullYear() - 1
                : new Date().getFullYear()}
              :
            </h2>
            <p className="ml-3 text-left w-[100px]">
              {numeral(
                previousMonthResults
                  .filter((da) => da.type === 'EXPENSE')
                  .reduce((total: number, item: any) => total + item.amount, 0),
              ).format('0,0')}
            </p>
          </div>

          <div className="border-t-2 border-gray-200 w-full" />

          {/* Current Month */}
          <div className="flex self-center w-full justify-center">
            <h2 className="text-sm font-semibold text-blue-800 w-[200px]">
              {new Date().toLocaleDateString('default', { month: 'long' })},{' '}
              {new Date().getFullYear()}:
            </h2>
            <p className="ml-3 text-left w-[100px]">
              {numeral(
                currentMonthResults
                  .filter((da: any) => da.type === 'EXPENSE')
                  .reduce((total: number, item: any) => total + item.amount, 0),
              ).format('0,0')}
            </p>
          </div>

          <div className="border-t-2 border-gray-200 w-full" />

          {/* Today */}
          {searchData.startDate === '' &&
          searchData.endDate === '' &&
          searchData.categoryId === 'ALL' ? (
            <div className="flex self-center w-full">
              <h2 className="text-sm font-semibold text-blue-800 w-[200px]">
                Today:{' '}
              </h2>
              <p className="ml-3 text-left w-[100px]">
                {numeral(
                  todayExpenses
                    .filter((da: any) => da.date === formatDate(new Date()))
                    .reduce(
                      (total: number, item: any) => total + item.amount,
                      0,
                    ),
                ).format('0,0')}
              </p>
            </div>
          ) : (
            ''
          )}

          {searchData.startDate === '' &&
          searchData.endDate === '' &&
          searchData.categoryId !== 'ALL' ? (
            <div className="flex self-center w-full">
              <h2 className="text-sm font-semibold text-blue-800 w-[200px]">
                {
                  allCategory?.find(
                    (category) => category.id === +searchData.categoryId,
                  )?.name
                }
                :{' '}
              </h2>
              <p className="ml-3 text-left w-[100px]">
                {numeral(
                  results
                    .filter((da: any) => da.type === 'EXPENSE')
                    .reduce(
                      (total: number, item: any) => total + item.amount,
                      0,
                    ),
                ).format('0,0')}
              </p>
            </div>
          ) : (
            ''
          )}

          {/* Custom Date Range */}
          {searchData.startDate !== '' &&
            searchData.endDate !== '' &&
            searchData.categoryId === 'ALL' && (
              <div className="flex self-center w-full">
                <h2 className="text-sm font-semibold text-blue-800 w-[190px]">
                  {formatDateWithDDMMYYYY(new Date(searchData.startDate))} to{' '}
                  {formatDateWithDDMMYYYY(new Date(searchData.endDate))}:
                </h2>
                <p className="ml-5 text-left w-[100px]">
                  {numeral(
                    results
                      .filter((da: any) => da.type === 'EXPENSE')
                      .reduce(
                        (total: number, item: any) => total + item.amount,
                        0,
                      ),
                  ).format('0,0')}
                </p>
              </div>
            )}
          {searchData.startDate !== '' &&
            searchData.endDate !== '' &&
            searchData.categoryId !== 'ALL' && (
              <div className="flex self-center w-full">
                <h2 className="text-sm font-semibold text-blue-800 w-[190px]">
                  {formatDateWithDDMMYYYY(new Date(searchData.startDate))} to{' '}
                  {formatDateWithDDMMYYYY(new Date(searchData.endDate))}:
                  <br />
                  {
                    // @ts-ignore
                    allCategory?.find(
                      (category) => category.id === +searchData.categoryId,
                    ).name
                  }
                </h2>
                <p className="ml-5 text-left w-[100px]">
                  {numeral(
                    results
                      .filter((da: any) => da.type === 'EXPENSE')
                      .reduce(
                        (total: number, item: any) => total + item.amount,
                        0,
                      ),
                  ).format('0,0')}
                </p>
              </div>
            )}
        </div>
        <div className="flex flex-col items-center self-center w-full">
          <h1 className="text-2xl font-semibold text-center">Income</h1>
          {/* Previous Month */}
          <div className="flex self-center w-full justify-center mt-2">
            <h2 className="text-sm font-semibold text-red-500 w-[200px]">
              {new Date(
                new Date().setMonth(new Date().getMonth() - 1),
              ).toLocaleString('default', { month: 'long' })}
              ,{' '}
              {new Date(
                new Date().setMonth(new Date().getMonth() - 1),
              ).toLocaleString('default', { month: 'long' }) === 'December'
                ? new Date().getFullYear() - 1
                : new Date().getFullYear()}
              :
            </h2>
            <p className="ml-3 text-left w-[100px]">
              {numeral(
                previousMonthResults
                  .filter((da) => da.type === 'INCOME')
                  .reduce((total: number, item: any) => total + item.amount, 0),
              ).format('0,0')}
            </p>
          </div>

          <div className="border-t-2 border-gray-200 w-full" />

          {/* Current Month */}
          <div className="flex self-center w-full justify-center">
            <h2 className="text-sm font-semibold text-blue-800 w-[200px]">
              {new Date().toLocaleDateString('default', { month: 'long' })},{' '}
              {new Date().getFullYear()}:
            </h2>
            <p className="ml-3 text-left w-[100px]">
              {numeral(
                currentMonthResults
                  .filter((da: any) => da.type === 'INCOME')
                  .reduce((total: number, item: any) => total + item.amount, 0),
              ).format('0,0')}
            </p>
          </div>

          <div className="border-t-2 border-gray-200 w-full" />

          {/* Today */}
          {searchData.startDate === '' &&
          searchData.endDate === '' &&
          searchData.categoryId === 'ALL' ? (
            <div className="flex self-center w-full">
              <h2 className="text-sm font-semibold text-blue-800 w-[200px]">
                Today:{' '}
              </h2>
              <p className="ml-3 text-left w-[100px]">
                {numeral(
                  todayIncome
                    .filter((da: any) => da.date === formatDate(new Date()))
                    .reduce(
                      (total: number, item: any) => total + item.amount,
                      0,
                    ),
                ).format('0,0')}
              </p>
            </div>
          ) : (
            ''
          )}

          {searchData.startDate === '' &&
          searchData.endDate === '' &&
          searchData.categoryId !== 'ALL' ? (
            <div className="flex self-center w-full">
              <h2 className="text-sm font-semibold text-blue-800 w-[200px]">
                {
                  allCategory?.find(
                    (category) => category.id === +searchData.categoryId,
                  )?.name
                }
                :{' '}
              </h2>
              <p className="ml-3 text-left w-[100px]">
                {numeral(
                  results
                    .filter((da: any) => da.type === 'INCOME')
                    .reduce(
                      (total: number, item: any) => total + item.amount,
                      0,
                    ),
                ).format('0,0')}
              </p>
            </div>
          ) : (
            ''
          )}

          {/* Custom Date Range */}
          {searchData.startDate !== '' &&
            searchData.endDate !== '' &&
            searchData.categoryId === 'ALL' && (
              <div className="flex self-center w-full">
                <h2 className="text-sm font-semibold text-blue-800 w-[190px]">
                  {formatDateWithDDMMYYYY(new Date(searchData.startDate))} to{' '}
                  {formatDateWithDDMMYYYY(new Date(searchData.endDate))}:
                </h2>
                <p className="ml-5 text-left w-[100px]">
                  {numeral(
                    results
                      .filter((da: any) => da.type === 'INCOME')
                      .reduce(
                        (total: number, item: any) => total + item.amount,
                        0,
                      ),
                  ).format('0,0')}
                </p>
              </div>
            )}
          {searchData.startDate !== '' &&
            searchData.endDate !== '' &&
            searchData.categoryId !== 'ALL' && (
              <div className="flex self-center w-full">
                <h2 className="text-sm font-semibold text-blue-800 w-[190px]">
                  {formatDateWithDDMMYYYY(new Date(searchData.startDate))} to{' '}
                  {formatDateWithDDMMYYYY(new Date(searchData.endDate))}:
                  <br />
                  {
                    // @ts-ignore
                    allCategory?.find(
                      (category) => category.id === +searchData.categoryId,
                    ).name
                  }
                </h2>
                <p className="ml-5 text-left w-[100px]">
                  {numeral(
                    results
                      .filter((da: any) => da.type === 'INCOME')
                      .reduce(
                        (total: number, item: any) => total + item.amount,
                        0,
                      ),
                  ).format('0,0')}
                </p>
              </div>
            )}
        </div>

        <div className="flex flex-col items-center self-center w-full">
          <h1 className="text-2xl font-semibold text-center">
            Accounts Balance
          </h1>

          <div className="flex self-center w-full justify-center">
            <h2 className="text-sm font-semibold text-blue-800 w-[200px]">
              {/* {new Date().toLocaleDateString('default', { month: 'long' })},{' '}
              {new Date().getFullYear()}: */}
              Cash Account:
            </h2>
            <p className="ml-3 text-left w-[100px]">
              {/* {thisMonthIncome === 0 ? (
                0
              ) : Math.sign(thisMonthIncome) === 1 ? (
                <span>{numeral(thisMonthIncome).format('0,0')}</span>
              ) : (
                <span className="text-red-500">
                  {numeral(Math.abs(thisMonthIncome)).format('0,0')}
                </span>
              )} */}
              {numeral(
                accounts.find((account) => account.accountName === 'Cash')
                  ?.balance,
              ).format('0,0')}
            </p>
          </div>

          {accounts.filter((account) => account.accountName !== 'Cash')
            .length === 0 ? (
            <div>
              <h2>You {`don't`} have any other accounts, Racoon 🦝!</h2>
            </div>
          ) : (
            <div className="flex self-center w-full justify-center">
              <h2 className="text-sm font-semibold text-blue-800 w-[200px]">
                {/* {new Date().toLocaleDateString('default', { month: 'long' })},{' '}
              {new Date().getFullYear()}: */}
                Other Accounts:
              </h2>
              <p className="ml-3 text-left w-[100px]">
                {/* {thisMonthIncome === 0 ? (
                0
              ) : Math.sign(thisMonthIncome) === 1 ? (
                <span>{numeral(thisMonthIncome).format('0,0')}</span>
              ) : (
                <span className="text-red-500">
                  {numeral(Math.abs(thisMonthIncome)).format('0,0')}
                </span>
              )} */}
                {numeral(
                  accounts
                    .filter((account) => account.accountName !== 'Cash')
                    .reduce((total: any, item: any) => total + item.balance),
                ).format('0,0')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-80 min-h-96 h-[26rem] bg-white rounded-lg shadow-md flex items-center flex-col justify-center p-4">
        <div className="relative flex justify-between items-center w-full py-2 px-4 rounded-md mt-1">
          <button
            className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded transition"
            type="button"
            onClick={handleIncomePreviousMonth}
          >
            &#8592; Prev
          </button>
          <div className="text-center flex self-center justify-self-center text-lg font-medium z-30">
            {currentDate2.toLocaleDateString('default', { month: 'short' })},{' '}
            {currentDate2.getFullYear()}
          </div>
          <button
            className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded transition"
            type="button"
            onClick={handleIncomeNextMonth}
          >
            Next &#8594;
          </button>
        </div>
        {doesIncomeMonthHaveTransactions ? (
          <Doughnut
            data={
              !incomeChartData
                ? {
                    labels: [],
                    datasets: [
                      {
                        data: [1, 1, 1, 1], // Single value of 0 to display empty chart
                        backgroundColor: [
                          '#E0E0E0',
                          '#C0C0C0',
                          '#B0B0B0',
                          '#A0A0A0',
                        ],

                        hoverBackgroundColor: [
                          '#E0E0E0',
                          '#C0C0C0',
                          '#B0B0B0',
                          '#A0A0A0',
                        ],
                      },
                    ],
                  }
                : incomeChartData
            }
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  enabled: (context) => {
                    // If value is 1, return false to hide the tooltip
                    const value = context?.tooltip?.dataPoints?.[0]?.raw;
                    return value !== 1;
                  },
                  callbacks: {
                    label: helpMePlz,
                  },
                },
                legend: {
                  display: false,
                },
              },

              onClick: handleIncomeClick,
            }}
          />
        ) : (
          <Doughnut
            data={{
              labels: [],
              datasets: [
                {
                  data: [1, 1, 1, 1], // Single value of 0 to display empty chart
                  backgroundColor: ['#E0E0E0', '#C0C0C0', '#B0B0B0', '#A0A0A0'],

                  hoverBackgroundColor: [
                    '#E0E0E0',
                    '#C0C0C0',
                    '#B0B0B0',
                    '#A0A0A0',
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  enabled: (context) => {
                    // If value is 1, return false to hide the tooltip
                    const value = context?.tooltip?.dataPoints?.[0]?.raw;
                    return value !== 1;
                  },
                  callbacks: {
                    label: helpMePlz,
                  },
                },
                legend: {
                  display: false,
                },
              },

              onClick: handleIncomeClick,
            }}
          />
        )}

        {doesIncomeMonthHaveTransactions && (
          <>
            <h1 className="mt-5">
              Total Income:{' '}
              <span className="font-semibold">
                {numeral(totalIncome).format('0,0')}
              </span>
            </h1>
            <button
              type="button"
              style={{
                color: getRandomDarkColor(),
              }}
              className="font-medium"
              onClick={handleIncomeMoreDetails}
            >
              More Details
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Charts;
