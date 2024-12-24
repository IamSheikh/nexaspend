/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useState, useEffect, useRef } from 'react';
import numeral from 'numeral';
import { useReactToPrint } from 'react-to-print';
import { ICategory } from '../../types';
import {
  calculateLuminance,
  getFirstAndLastDayOfMonth,
  getRandomColor,
} from '../utils';

const Sidebar = ({
  toggleSidebar,
  isOpen,
  setIsOpen,
  currentMonthExpenses,
  searchData,
  setSearchData,
  setResults,
  setBackgroundColor,
  setTextColor,
}: {
  toggleSidebar: any;
  isOpen: any;
  setIsOpen: any;
  currentMonthExpenses: any;
  searchData: any;
  setSearchData: any;
  setResults: any;
  setBackgroundColor: any;
  setTextColor: any;
}) => {
  const ref = useRef<any>(null);
  const [expenseCategories, setExpenseCategories] = useState<ICategory[]>([]);
  const [printingMode, setPrintingMode] = useState(false);

  useEffect(() => {
    (async () => {
      const allCategories =
        (await window.electron.getAllCategories()) as ICategory[];
      const filteredCategories = allCategories.filter(
        (category: any) => category.type === 'EXPENSE',
      );
      setExpenseCategories(filteredCategories);
    })();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: ref,
  });

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-gray-200 w-64 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out ${printingMode && 'w-screen'}`}
      ref={ref}
      // style={{ zIndex: 50000000 }}
    >
      <div
        className={`flex items-center justify-between px-4 py-4 ${printingMode && 'hidden'}`}
      >
        <h2>Expenses By Category</h2>
        <button
          onClick={toggleSidebar}
          type="button"
          className={`${printingMode && 'hidden'}`}
        >
          ✕
        </button>
      </div>
      <h2 className={`${!printingMode && 'hidden'} text-center px-4 py-4`}>
        Expenses By Category
      </h2>
      <h2 className={`${!printingMode && 'hidden'} text-center`}>
        {searchData.startDate === '' && searchData.endDate === ''
          ? `${new Date().toLocaleDateString('default', { month: 'long' })}, 
            ${new Date().getFullYear()}`
          : `${searchData.startDate} to ${searchData.endDate}`}
      </h2>
      <h2 className={`${!printingMode && 'hidden'} text-center mt-4`}>
        Total Category Expenses:{' '}
        {numeral(
          currentMonthExpenses.reduce(
            (total: any, item: any) => total + item.amount,
            0,
          ),
        ).format('0,0')}
      </h2>
      <div className="flex flex-col px-4 py-2">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="py-2 text-left text-sm font-semibold">Category</th>
              <th className="py-2 text-right text-sm font-semibold">Expense</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {expenseCategories.map((cate) => {
              const totalAmount = currentMonthExpenses.reduce(
                (total: any, item: any) =>
                  item.categoryId === cate.id ? total + item.amount : total,
                0,
              );

              return (
                <tr
                  key={cate.id}
                  className="text-black cursor-pointer"
                  onClick={async () => {
                    const clone = { ...searchData };
                    clone.categoryId = cate.id as unknown as string;
                    setSearchData(clone);
                    const isThereDates =
                      searchData.startDate !== '' && searchData.endDate;
                    const filteredResults =
                      await window.electron.getDaybookByFilters(
                        isThereDates
                          ? [searchData.startDate, searchData.endDate]
                          : [
                              getFirstAndLastDayOfMonth().firstDay,
                              getFirstAndLastDayOfMonth().lastDay,
                            ],
                        searchData.entryType,
                        clone.categoryId,
                      );
                    setResults(filteredResults);
                    setIsOpen(false);
                    const newColor = getRandomColor();
                    setBackgroundColor(newColor);
                    setTextColor(calculateLuminance(newColor));
                  }}
                >
                  <td className="text-left text-sm font-medium">{cate.name}</td>
                  <td className="text-sm text-black text-right">
                    {numeral(totalAmount).format('0,0')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end align-end">
          <button
            type="button"
            className={`bg-green-800 hover:bg-green-900 px-3 py-1 text-white rounded transition-all duration-300 ease-in-out ${printingMode && 'hidden'}`}
            onClick={() => {
              setPrintingMode(true);
              setTimeout(() => {
                handlePrint();
                setPrintingMode(false);
              }, 0);
            }}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
