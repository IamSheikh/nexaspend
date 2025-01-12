/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */

import { useState, useEffect, useRef } from 'react';
import numeral from 'numeral';
import { IParty, ITransactionAccount } from '../../types';
import { getFirstAndLastDayOfMonth } from '../utils';

const MainLedgerTable = ({
  printingMode,
  activeTab,
  ledgerTableRef,
  currentLedgerData,
  setRefreshState,
  //   setIsUpdateDaybook,
  // setSelectedLedger,
  //   setIsDeleteTransactionModalOpen,
  // handleLedgerDownloadPdf,
  handleLedgerPageChange,
  ledgerCurrentPage,
  ledgerTotalPages,
  // ledgerSearchData,
  printLedgerTable,
  currentAccountId,
  refreshState,
  isLedgerTableFooterShowing,
  selectedParty,
  setLedgerResults,
  setLedgerCurrentPage,
  setSelectedLedger,
  setIsUpdateLedger,
  setIsLedgerShowing,
  isUpdateLedger,
}: {
  printingMode: any;
  activeTab: any;
  ledgerTableRef: any;
  currentLedgerData: any;
  setRefreshState: any;
  //   setIsUpdateDaybook: any;
  // setSelectedLedger: any;
  //   setIsDeleteTransactionModalOpen: any;
  printLedgerTable: any;
  // handleLedgerDownloadPdf: any;
  handleLedgerPageChange: any;
  ledgerCurrentPage: any;
  ledgerTotalPages: any;
  // ledgerSearchData: any;
  currentAccountId: any;
  refreshState: any;
  isLedgerTableFooterShowing: any;
  selectedParty: any;
  setLedgerResults: any;
  setLedgerCurrentPage: any;
  setSelectedLedger: any;
  setIsUpdateLedger: any;
  setIsLedgerShowing: any;
  isUpdateLedger: any;
}) => {
  const startDateRef = useRef<any>();
  const endDateRef = useRef<any>();
  const [allParties, setAllParties] = useState<IParty[]>([]);
  const [currentParty, setCurrenParty] = useState<IParty>();
  const [ledgerSearchData, setLedgerSearchData] = useState({
    startDate: '',
    endDate: '',
    transactionType: '',
  });
  const [transactionAccounts, setTransactionAccounts] = useState<
    ITransactionAccount[]
  >([]);

  useEffect(() => {
    (async () => {
      const parties = (await window.electron.getAllParties(
        // @ts-ignore
        currentAccountId,
      )) as IParty[];
      const cp = parties.find((party) => party.id === selectedParty.id);
      setCurrenParty(cp);
      setAllParties(parties);

      const allTransactionAccounts =
        await window.electron.getAllTransactionAccounts(
          // @ts-ignore
          +localStorage.getItem('currentAccountId'),
        );

      setTransactionAccounts(allTransactionAccounts);
    })();
  }, [currentAccountId, refreshState, isUpdateLedger]);

  const handleSearch = async () => {
    const { firstDay, lastDay } = getFirstAndLastDayOfMonth();
    const isThereDates =
      ledgerSearchData.startDate !== '' && ledgerSearchData.endDate;
    const filteredResults = await window.electron.getLedgerByFilters(
      isThereDates
        ? [ledgerSearchData.startDate, ledgerSearchData.endDate]
        : [firstDay, lastDay],
      ledgerSearchData.transactionType,
      selectedParty.id,
      // @ts-ignore
      localStorage.getItem('currentAccountId'),
    );

    setLedgerResults(filteredResults);
    setLedgerCurrentPage(1);
  };

  useEffect(() => {
    if (ledgerSearchData.startDate !== '' && ledgerSearchData.endDate !== '') {
      handleSearch();
    }
  }, [ledgerSearchData.startDate, ledgerSearchData.endDate]);

  return (
    <>
      <div
        className="ml-2 mt-2 cursor-pointer w-5"
        onClick={() => {
          setIsLedgerShowing((prev: any) => !prev);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </div>

      <div
        className={`${!printingMode && 'flex justify-center self-center items-center flex-col mb-4'} ${activeTab !== 'Ledger' && ''}`}
      >
        <div ref={ledgerTableRef} className="items-center flex flex-col">
          <h1 className="text-2xl font-semibold mt-4 text-center">
            {selectedParty.partyName}:
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start w-full max-w-6xl bg-white shadow-sm p-4 rounded-lg">
            {/* Date By Section */}
            {!printingMode && (
              <div className="flex flex-col mb-4 md:mb-0 md:w-1/3">
                <label className="font-semibold text-gray-700 mb-2">
                  Date By:
                </label>
                <div className="flex items-center">
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-2 py-1"
                    ref={startDateRef}
                    value={ledgerSearchData.startDate}
                    onChange={(e) =>
                      setLedgerSearchData({
                        ...ledgerSearchData,
                        startDate: e.target.value,
                      })
                    }
                  />
                  <span className="mx-2">→</span>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-2 py-1"
                    ref={endDateRef}
                    value={ledgerSearchData.endDate}
                    onChange={(e) =>
                      setLedgerSearchData({
                        ...ledgerSearchData,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* Party Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 md:w-2/3">
              {/* Address */}
              <div>
                <span className="font-semibold text-gray-700">Address:</span>
                <span className="ml-2">{selectedParty?.address || ''}</span>
              </div>

              {/* Phone Number */}
              <div>
                <span className="font-semibold text-gray-700">
                  Phone Number:
                </span>
                <span className="ml-2">
                  {selectedParty?.mobileNumber || ''}
                </span>
              </div>

              {/* Details */}
              <div>
                <span className="font-semibold text-gray-700">Details:</span>
                <span className="ml-2">{selectedParty?.details || ''}</span>
              </div>

              {/* Balance */}
              <div>
                <span className="font-semibold text-gray-700">Balance:</span>
                <span className="ml-2">
                  {currentParty?.balance === 0 ? (
                    0
                  ) : Math.sign(currentParty?.balance as number) !== -1 ? (
                    numeral(currentParty?.balance).format('0,0')
                  ) : (
                    <span className="text-red-500">
                      {numeral(
                        Math.abs(currentParty?.balance as number),
                      ).format('0,0')}
                    </span>
                  )}
                </span>
              </div>

              {/* Email */}
              <div>
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="ml-2">{selectedParty?.email || ''}</span>
              </div>
            </div>
          </div>

          <table
            className={`border-collapse w-[95vw]  mt-5 `}
            id="table-container"
          >
            <thead
              className={`border border-gray-300 sticky ${printingMode ? '' : 'z-40'} specific-thead`}
              // style={{ zIndex: 50000000 }}
            >
              <tr className="bg-gray-200">
                <th
                  className={`border border-gray-300 ${printingMode && 'text-center'}`}
                >
                  Date
                </th>
                <th
                  className={`border border-gray-300 ${printingMode && 'text-center'}`}
                >
                  Type
                </th>
                <th
                  className={`border border-gray-300 ${printingMode && 'text-center'}`}
                >
                  Account
                </th>
                <th
                  className={`border border-gray-300 ${printingMode && 'text-center'}`}
                >
                  Details
                </th>
                <th
                  className={`border border-gray-300 ${printingMode && 'text-center'}`}
                >
                  You Gave
                </th>
                <th
                  className={`border border-gray-300 ${printingMode && 'text-center w-32'}`}
                >
                  You Received
                </th>
                {/* <th
                className={`border border-gray-300 ${printingMode && 'text-center w-32'}`}
              >
                Balance
              </th> */}
              </tr>
            </thead>

            <tbody className="border border-gray-300">
              {currentLedgerData.map((da: any) => (
                <tr
                  className="text-center"
                  key={da.id}
                  onClick={() => {
                    setSelectedLedger(da);
                    setIsUpdateLedger(true);
                  }}
                >
                  <td
                    className={`border border-gray-300 ${printingMode && 'pb-2 w-32'}`}
                  >
                    {da.date}
                  </td>
                  <td
                    className={`border border-gray-300 text-left px-2 ${printingMode && 'pb-2'}`}
                  >
                    {da.transaction_type === 'YOU GAVE'
                      ? 'You Gave'
                      : 'You Received'}
                  </td>
                  <td
                    className={`border border-gray-300 text-left px-2 ${printingMode && 'pb-2'}`}
                  >
                    {
                      transactionAccounts.find(
                        (ta) => ta.id === da.transactionAccountId,
                      )?.accountName
                    }
                  </td>
                  <td
                    className={`border border-gray-300 text-left px-2 ${printingMode && 'pb-2'}`}
                  >
                    {da.details}
                  </td>
                  <td
                    className={`border border-gray-300 text-right px-2 ${printingMode && 'pb-2'}`}
                  >
                    {da.transaction_type === 'YOU GAVE' &&
                      numeral(da.amount).format('0,0')}
                  </td>
                  <td
                    className={`border border-gray-300 text-right px-2 ${printingMode && 'pb-2'}`}
                  >
                    {da.transaction_type === 'YOU RECEIVED' &&
                      numeral(da.amount).format('0,0')}
                  </td>
                  {/* <td
                  className={`border border-gray-300 text-right px-2 ${printingMode && 'pb-2'}`}
                >
                  {numeral(selectedParty.balance).format('0,0')}
                </td> */}
                </tr>
              ))}
            </tbody>
            {/* <tfoot className="flex justify-end border-red-500"> */}
            {/* </tfoot> */}
          </table>
        </div>

        {isLedgerTableFooterShowing && (
          <div className="flex w-[95vw] justify-between">
            <div className="flex justify-start self-start items-start mt-4 ml-2">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-3"
                type="button"
                onClick={() => {
                  printLedgerTable();
                }}
              >
                Print
              </button>
              {/* <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-3"
              type="button"
              // onClick={handleLedgerDownloadPdf}
            >
              Download
            </button> */}
            </div>

            <div className="flex justify-end self-end items-end mt-4 ml-2 mr-5">
              <button
                onClick={() => handleLedgerPageChange(1)}
                disabled={ledgerCurrentPage === 1}
                className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                type="button"
              >
                {'<<'}
              </button>
              <button
                onClick={() => handleLedgerPageChange(ledgerCurrentPage - 1)}
                disabled={ledgerCurrentPage === 1}
                className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                type="button"
              >
                {'<'}
              </button>
              <button
                className="px-3 py-1 mx-1 rounded bg-blue-500 text-white"
                type="button"
              >
                {ledgerCurrentPage} of{' '}
                {ledgerTotalPages === 0 ? '1' : ledgerTotalPages}
              </button>
              <button
                onClick={() => handleLedgerPageChange(ledgerCurrentPage + 1)}
                type="button"
                disabled={ledgerCurrentPage === ledgerTotalPages}
                className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {'>'}
              </button>
              <button
                onClick={() => handleLedgerPageChange(ledgerTotalPages)}
                type="button"
                disabled={ledgerCurrentPage === ledgerTotalPages}
                className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {'>>'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MainLedgerTable;
