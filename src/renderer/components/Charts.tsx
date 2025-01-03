/* eslint-disable prettier/prettier */
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
import { ICategory, IDaybook } from '../../types';
import colors from '../utils/100000_colors';
import hover_colors from '../utils/100000_hover_colors';
import { getFirstAndLastDayOfMonth } from '../utils';
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
}: {
  searchData: any;
  currentAccountId: number;
  refreshState: any;
  setSearchData: any;
  setResults: any;
  setBackgroundColor: any;
  setTextColor: any;
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
  const [currentDate1, setCurrentDate1] = useState(new Date());
  const [currentDate2, setCurrentDate2] = useState(new Date());
  const [
    doesExpenseMonthHaveTransactions,
    setDoesExpenseMonthHaveTransactions,
  ] = useState(true);
  const [doesIncomeMonthHaveTransactions, setDoesIncomeMonthHaveTransactions] =
    useState(true);

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
        // Get category name and percentage
        const categoryName = tooltipItem.label;
        const percentage = parseInt(tooltipItem.raw, 10).toFixed(2);
        // Find the total amount for the category
        const categoryId = expenseCategories.find(
          (category) => category.name === categoryName,
        )?.id;
        const totalAmount = categoryId ? aggregatedData[categoryId] : 0;
        if (categoryId) {
          selectedCategoryId = categoryId;
        }

        // Return tooltip content with category total
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
          // const firstPoint = activePoints[0];
          // const categoryId = expenseCategories.find(
          //   (category) => category.id === firstPoint.index,
          // );
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
  }, [refreshState, currentDate1]);

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
        // Get category name and percentage
        const categoryName = tooltipItem.label;
        const percentage = parseInt(tooltipItem.raw, 10).toFixed(2);
        // Find the total amount for the category
        const categoryId = expenseCategories.find(
          (category) => category.name === categoryName,
        )?.id;
        const totalAmount = categoryId ? aggregatedData[categoryId] : 0;

        // Return tooltip content with category total
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
  }, [refreshState, currentDate2]);

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
      (prevDate) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
    );
  };

  const handlePreviousMonth = () => {
    setCurrentDate1(
      (prevDate) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
    );
  };

  const handleIncomeNextMonth = () => {
    setCurrentDate2(
      (prevDate) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
    );
  };

  const handleIncomePreviousMonth = () => {
    setCurrentDate2(
      (prevDate) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
    );
  };

  return (
    <div className="flex justify-center items-center space-x-2 p-4 bg-gray-100">
      {/* <div className="w-72 min-h-72 bg-white rounded-lg shadow-md flex-col flex items-center justify-center p-4"> */}
      <div className="w-80 min-h-72 h-96 bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-4">
        {/* Display a message if no expense data is available */}
        {!expenseChartData && (
          <h1 className="text-xl font-medium text-gray-700">No Expense</h1>
        )}

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
            <div className="flex justify-center items-center h-full">
              <h1 className="text-2xl font-medium">No Expense</h1>
            </div>
          )}
        </div>

        {/* Total Expenses */}
        {doesExpenseMonthHaveTransactions && (
          <h1 className="mt-4 text-gray-800 text-center">
            Total Expenses:{' '}
            <span className="font-semibold text-gray-900">
              {numeral(totalExpense).format('0,0')}
            </span>
          </h1>
        )}
      </div>

      <div className="w-80 min-h-72 h-96 bg-white rounded-lg shadow-md flex items-center flex-col justify-center p-4">
        {/* <div className="mt-1">
          {!incomeChartData ? (
            <h1 className="text-xl font-medium">No Income</h1>
          ) : (
            <div>
              {new Date().toLocaleDateString('default', {
                month: 'short',
              })}
              , {new Date().getFullYear()}
            </div>
          )}
        </div> */}
        {!incomeChartData && (
          <h1 className="text-xl font-medium text-gray-700">No Expense</h1>
        )}

        {/* Month Navigator */}
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
          <div className="flex justify-center items-center h-full">
            <h1>No Income</h1>
          </div>
        )}

        {doesIncomeMonthHaveTransactions && (
          <h1 className="mt-5">
            Total Income:{' '}
            <span className="font-semibold">
              {numeral(totalIncome).format('0,0')}
            </span>
          </h1>
        )}
      </div>
    </div>
  );
};

export default Charts;
