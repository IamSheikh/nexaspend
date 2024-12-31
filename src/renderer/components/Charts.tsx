/* eslint-disable prettier/prettier */
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
import { ICategory, IDaybook } from '../../types';
import colors from '../utils/100000_colors';
import hover_colors from '../utils/100000_hover_colors';
import { getFirstAndLastDayOfMonth } from '../utils';

ChartJS.register(ArcElement, Tooltip, Legend);

const Charts = ({
  currentAccountId,
  refreshState,
}: {
  currentAccountId: number;
  refreshState: any;
}) => {
  const [expenseChartData, setExpenseChartData] = useState<any>(null);
  const [incomeChartData, setIncomeChartData] = useState<any>(null);

  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    setExpenseChartData(null);
    setIncomeChartData(null);
  }, [currentAccountId]);

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
        console.log('No expense categories available.');
        return;
      }

      // Fetch all transactions for the current account
      const allTransactions = (await window.electron.getDaybookByFilters(
        [
          getFirstAndLastDayOfMonth().firstDay,
          getFirstAndLastDayOfMonth().lastDay,
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
        console.log('No expense transactions available.');
        return;
      }

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

      // Step 5: Update chart data
      setExpenseChartData({
        labels,
        datasets: [
          {
            label: 'Expense Distribution (%)',
            data,
            backgroundColor: result.map((item) => item.backgroundColor),
            hoverBackgroundColor: result.map((item) => item.hoverColor),
          },
        ],
      });
    };

    fetchData();
  }, [refreshState]);

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
        console.log('No income categories available.');
        return;
      }

      // Fetch all transactions for the current account
      const allTransactions = (await window.electron.getDaybookByFilters(
        [
          getFirstAndLastDayOfMonth().firstDay,
          getFirstAndLastDayOfMonth().lastDay,
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
        console.log('No income transactions available.');
        return;
      }

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

      // Step 5: Update chart data
      setIncomeChartData({
        labels,
        datasets: [
          {
            label: 'Income Distribution (%)',
            data,
            backgroundColor: result.map((item) => item.backgroundColor),
            hoverBackgroundColor: result.map((item) => item.hoverColor),
          },
        ],
      });
    };

    fetchData();
  }, [refreshState]);

  useEffect(() => {
    (async () => {
      const allTransactions = (await window.electron.getDaybookByFilters(
        [
          getFirstAndLastDayOfMonth().firstDay,
          getFirstAndLastDayOfMonth().lastDay,
        ],
        'ALL',
        'ALL',
        currentAccountId,
      )) as IDaybook[];
      const allExpenses = allTransactions.filter(
        (transaction) => transaction.type === 'EXPENSE',
      );
      const allIncome = allTransactions.filter(
        (transaction) => transaction.type === 'INCOME',
      );

      const expensesTotal = allExpenses.reduce(
        (total: number, item: any) => total + item.amount,
        0,
      );
      const incomeTotal = allIncome.reduce(
        (total: number, item: any) => total + item.amount,
        0,
      );

      setTotalExpense(expensesTotal);
      setTotalIncome(incomeTotal);
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

  return (
    <div className="flex justify-center items-center space-x-4 p-4 bg-gray-100">
      {/* <div className="w-72 min-h-72 bg-white rounded-lg shadow-md flex-col flex items-center justify-center p-4"> */}
      <div className="w-80 min-h-72 h-96 bg-white rounded-lg shadow-md flex items-center flex-col justify-center p-4">
        <div className="mt-1">
          {!expenseChartData ? (
            <h1 className="text-xl font-medium">No Expense</h1>
          ) : (
            <h1 className="text-xl font-medium">Monthly Expense Breakdown</h1>
          )}
        </div>
        <Doughnut
          data={
            !expenseChartData
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
              : expenseChartData
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
              },
            },
          }}
        />
        <h1 className="mt-5">
          Total Expenses:{' '}
          <span className="font-semibold">
            {numeral(totalExpense).format('0,0')}
          </span>
        </h1>
      </div>
      <div className="w-80 min-h-72 h-96 bg-white rounded-lg shadow-md flex items-center flex-col justify-center p-4">
        <div className="mt-1">
          {!incomeChartData ? (
            <h1 className="text-xl font-medium">No Income</h1>
          ) : (
            <h1 className="text-xl font-medium">Monthly Income Breakdown</h1>
          )}
        </div>
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
              },
              legend: {
                display: true,
                position: 'top', // Legend position at the top
                labels: {
                  // Customize legend size for space management
                  boxWidth: 10,
                  padding: 10,
                  // @ts-ignore
                  filter: (legendItem) => legendItem.index < 10, // Limit number of categories in legend
                  // @ts-ignore
                  generateLabels: (chart) => {
                    const labels = chart.data.labels || [];
                    return labels.slice(0, 10).map((label, index) => {
                      return {
                        text: label,
                        fillStyle:
                          // @ts-ignore
                          chart?.data?.datasets[0].backgroundColor[index],
                        index,
                      };
                    });
                  },
                },
              },
            },
          }}
        />

        <h1 className="mt-5">
          Total Income:{' '}
          <span className="font-semibold">
            {numeral(totalIncome).format('0,0')}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default Charts;
