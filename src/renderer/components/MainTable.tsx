/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useState, useEffect } from 'react';
import numeral from 'numeral';
import { ICategory } from '../../types';

const MainTable = ({
  printingMode,
  activeTab,
  tableRef,
  currentData,
  setRefreshState,
  setIsUpdateDaybook,
  setSelectedDaybook,
  setIsDeleteTransactionModalOpen,
  handleDownloadPDF,
  handlePageChange,
  currentPage,
  totalPages,
  searchData,
  printTable,
  currentAccountId,
  refreshState,
}: {
  printingMode: any;
  activeTab: any;
  tableRef: any;
  currentData: any;
  setRefreshState: any;
  setIsUpdateDaybook: any;
  setSelectedDaybook: any;
  setIsDeleteTransactionModalOpen: any;
  printTable: any;
  handleDownloadPDF: any;
  handlePageChange: any;
  currentPage: any;
  totalPages: any;
  searchData: any;
  currentAccountId: any;
  refreshState: any;
}) => {
  const [expenseCategories, setExpenseCategories] = useState<ICategory[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<ICategory[]>([]);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    (async () => {
      console.log(localStorage.getItem('currentAccountId'));
      const categories = (await window.electron.getAllCategories(
        // @ts-ignore
        currentAccountId,
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
    })();
  }, [currentAccountId, refreshState]);

  return (
    <div
      className={`${!printingMode && 'flex justify-center self-center items-center flex-col mb-4'} ${activeTab !== 'Transaction' && 'hidden'}`}
    >
      <div
        className={`flex flex-col justify-center items-center `}
        ref={tableRef}
      >
        {printingMode && (
          <div className="text-center mb-2">
            <h2 className="text-xl font-semibold">
              {searchData.categoryId === 'ALL'
                ? 'All Categories Expenses'
                : `${
                    // @ts-ignore
                    allCategories?.find(
                      (category) => category.id === +searchData.categoryId,
                    ).name
                  } Expenses`}
            </h2>
            {searchData.startDate !== '' && searchData.endDate !== '' ? (
              <h2>
                {searchData.startDate} to {searchData.endDate}
              </h2>
            ) : (
              <h2>
                {new Date().toLocaleDateString('default', { month: 'long' })},{' '}
                {new Date().getFullYear()}
              </h2>
            )}
          </div>
        )}
        <table className={`border-collapse w-[95vw]  `} id="table-container">
          <thead
            className={`border border-gray-300 sticky ${printingMode ? '' : 'top-[10.3rem] z-40'} specific-thead`}
            // style={{ zIndex: 50000000 }}
          >
            <tr className="bg-gray-200">
              <th
                className={`border border-gray-300 ${printingMode && 'pb-2 text-center'}`}
              >
                Date
              </th>
              <th
                className={`border border-gray-300 ${printingMode && 'pb-2 text-center'}`}
              >
                Type
              </th>
              <th
                className={`border border-gray-300 ${printingMode && 'pb-2 text-center'}`}
              >
                Category
              </th>
              <th
                className={`border border-gray-300 ${printingMode && 'px-2 pb-2 mb-2 text-center'}`}
              >
                Details
              </th>
              <th
                className={`border border-gray-300 ${printingMode && 'pb-2 text-center'}`}
              >
                Income
              </th>
              <th
                className={`border border-gray-300 ${printingMode && 'px-2 pb-2 mb-2 text-center'}`}
              >
                Expense
              </th>
              {/* <th
                className={`border border-gray-300 ${printingMode && 'hidden'} no-print`}
              >
                Actions
              </th> */}
            </tr>
          </thead>

          <tbody className="border border-gray-300">
            {currentData.map((da: any) => (
              <tr
                className="text-center"
                key={da.id}
                onClick={() => {
                  setIsUpdateDaybook(true);
                  setSelectedDaybook(da);
                }}
              >
                <td
                  className={`border border-gray-300 ${printingMode && 'pb-2'}`}
                >
                  {da.date}
                </td>
                <td
                  className={`border border-gray-300 text-left px-2 ${printingMode && 'pb-2'}`}
                >
                  {da.type === 'INCOME' ? 'Income' : 'Expense'}
                </td>
                <td
                  className={`border border-gray-300 text-left px-2 ${printingMode && 'pb-2'}`}
                >
                  {/* {allCate.find((c) => c.id === da.categoryId)?.name} */}
                  {da.type === 'EXPENSE'
                    ? expenseCategories.find((c) => c.id === da.categoryId)
                        ?.name
                    : incomeCategories.find((c) => c.id === da.categoryId)
                        ?.name}
                </td>
                <td
                  className={`border border-gray-300 text-left px-2 ${printingMode && 'pb-2'}`}
                >
                  {da.details}
                </td>
                <td
                  className={`border border-gray-300 text-right px-2 ${printingMode && 'pb-2'}`}
                >
                  {da.type === 'INCOME' && numeral(da.amount).format('0,0')}
                </td>
                <td
                  className={`border border-gray-300 text-right px-2 ${printingMode && 'pb-2'}`}
                >
                  {da.type === 'EXPENSE' && numeral(da.amount).format('0,0')}
                </td>
                {/* <td
                  className={`border border-gray-300 items-center justify-center flex ${printingMode && 'hidden'} no-print`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsUpdateDaybook(true);
                      setSelectedDaybook(da);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="16"
                      height="20"
                    >
                      <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="bg-transparent font-semibold py-1 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ml-2"
                    onClick={async () => {
                      setSelectedDaybook(da);
                      setIsDeleteTransactionModalOpen(true);
                      setRefreshState((prev: any) => !prev);
                    }}
                  >
                    X
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
          {/* <tfoot className="flex justify-end border-red-500"> */}
          {/* </tfoot> */}
        </table>
      </div>

      <div className="flex w-[95vw] justify-between">
        <div className="flex justify-start self-start items-start mt-4 ml-2">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-3"
            type="button"
            onClick={() => {
              printTable();
            }}
          >
            Print
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-3"
            type="button"
            onClick={handleDownloadPDF}
          >
            Download
          </button>
        </div>

        <div className="flex justify-end self-end items-end mt-4 ml-2 mr-5">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            type="button"
          >
            {'<<'}
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            type="button"
          >
            {'<'}
          </button>
          <button
            className="px-3 py-1 mx-1 rounded bg-blue-500 text-white"
            type="button"
          >
            {currentPage} of {totalPages === 0 ? '1' : totalPages}
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            type="button"
            disabled={currentPage === totalPages}
            className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {'>'}
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            type="button"
            disabled={currentPage === totalPages}
            className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainTable;
